import { generateToken, verifyToken } from '@exam/core'
import { PrismaService } from '@exam/db'
import {
	Injectable,
	UnauthorizedException,
	BadRequestException
} from '@nestjs/common'

import {
	GetAnswersArgs,
	AdminLoginArgs,
	CreateExamArgs,
	CreateQuestionArgs,
	DeleteQuestionArgs,
	UpdateExamArgs,
	UpdateQuestionArgs
} from './admin/admin.dto'
import { GetQuestionsArgs, SubmitExamArgs } from './public/public.dto'

@Injectable()
export class AppService {
	constructor(private readonly db: PrismaService) {}

	private async verifyAdmin(token) {
		try {
			if (!token) {
				throw new UnauthorizedException()
			}
			const auth = token.split(' ')[1]
			const { id } = verifyToken(auth)
			const { username } = JSON.parse(id)
			const { value: storedUsername } = await this.db.setting.findUnique({
				where: {
					key: 'ADMIN_USER_USERNAME'
				},
				select: {
					value: true
				}
			})
			if (username === storedUsername) {
				return
			}
		} catch {
			throw new UnauthorizedException()
		}
		throw new UnauthorizedException()
	}

	private getSetting(key) {
		return this.db.setting.findUnique({
			where: {
				key
			},
			select: {
				value: true
			}
		})
	}

	//! Query

	getExams() {
		return this.db.exam.findMany()
	}

	getQuestions(args?: GetQuestionsArgs) {
		const { examId } = args || {}

		return this.db.question.findMany({
			where: {
				...(examId && { examId })
			}
		})
	}

	async getAnswers(token, args?: GetAnswersArgs) {
		await this.verifyAdmin(token)
		const { examId } = args || {}

		return this.db.examSubmit.findMany({
			where: {
				...(examId && { examId })
			}
		})
	}

	//! Mutation

	async login(args: AdminLoginArgs) {
		const { username, password } = args || {}
		if (!username || !password) {
			throw new UnauthorizedException()
		}
		const { value: storedUsername } = await this.db.setting.findUnique({
			where: {
				key: 'ADMIN_USER_USERNAME'
			},
			select: {
				value: true
			}
		})
		const { value: storedPassword } = await this.db.setting.findUnique({
			where: {
				key: 'ADMIN_USER_PASSWORD'
			},
			select: {
				value: true
			}
		})
		if (username === storedUsername && password === storedPassword) {
			return generateToken(JSON.stringify({ username }))
		}
		throw new UnauthorizedException()
	}

	async createExam(args: CreateExamArgs, token) {
		await this.verifyAdmin(token)
		const { name, questions } = args
		const exist = await this.db.exam.findFirst({
			where: {
				name
			}
		})
		if (exist) {
			throw new BadRequestException('Exam already exists')
		}
		const exam = await this.db.exam.create({
			data: {
				name
			}
		})
		for (const question of questions) {
			const { text, answer } = question
			await this.db.question.create({
				data: {
					examId: exam.id,
					text,
					answer
				}
			})
		}

		return exam
	}

	async updateExam(args: UpdateExamArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args
		const updatedExam = await this.db.exam.update({
			where: { id: examId },
			data
		})

		return updatedExam
	}

	async createQuestion(args: CreateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args
		const question = await this.db.question.create({
			data: {
				examId,
				...data
			}
		})

		return question
	}

	async updateQuestion(args: UpdateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId, data } = args
		const updatedQuestion = await this.db.question.update({
			where: { id: questionId },
			data
		})

		return updatedQuestion
	}

	async deleteQuestion(args: DeleteQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId } = args
		await this.db.question.delete({
			where: { id: questionId }
		})

		return true
	}

	submitExam(args: SubmitExamArgs) {
		const { examId, data } = args
		if (!examId || !data) {
			throw new BadRequestException('Missing examId or data')
		}

		return this.db.$transaction(async (tx) => {
			const { value: passingPercent } = await this.getSetting(
				'EXAM_PASS_PERCENT'
			)
			const existStudent = await tx.examSubmit.findMany({
				where: {
					examId,
					studentId: data.studentId
				}
			})
			if (existStudent.length > 0) {
				for (const data of existStudent) {
					if (data.passed === true) {
						throw new BadRequestException('Exam already passed')
					}
				}
			}
			let point = 0
			const { questions } = await tx.exam.findUnique({
				where: { id: examId },
				include: { questions: true }
			})
			for (const question of questions) {
				const studentAnswer = data.answers.find(
					(answer) => answer.questionId === question.id
				)
				if (studentAnswer && studentAnswer.answer === question.answer) {
					point++
				}
			}
			const passed = point / questions.length >= +passingPercent / 100
			const examSubmit = await tx.examSubmit.create({
				data: {
					examId,
					studentId: data.studentId,
					studentName: data.studentName,
					studentBranch: data.studentBranch,
					answers: JSON.stringify(data.answers),
					point,
					passed
				}
			})

			return examSubmit
		})
	}
}
