import { generateToken, verifyToken } from '@exam/core'
import { PrismaService } from '@exam/db'
import {
	Injectable,
	UnauthorizedException,
	BadRequestException
} from '@nestjs/common'
import * as cuid from 'cuid'

import {
	GetAnswersArgs,
	AdminLoginArgs,
	CreateExamArgs,
	UpdateExamArgs,
	DeleteExamArgs,
	CreateQuestionArgs,
	DeleteQuestionArgs,
	UpdateQuestionArgs,
	UpdateSettingArgs
} from './admin/admin.dto'
import {
	GetQuestionsArgs,
	GetResultArgs,
	SubmitExamArgs
} from './public/public.dto'

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
			const { value: storedUsername } = await this.getSetting(
				'ADMIN_USER_USERNAME'
			)
			if (username === storedUsername) {
				return
			}
			throw new UnauthorizedException()
		} catch {
			throw new UnauthorizedException()
		}
	}

	private getSetting(key) {
		const setting = this.db.setting.findUnique({
			where: {
				key
			},
			select: {
				value: true
			}
		})
		if (!setting) {
			throw new BadRequestException('Setting not found')
		}

		return setting
	}

	//! Query

	async getStats(token) {
		await this.verifyAdmin(token)
		return this.db.$transaction(async (tx) => {
			const examCount = await tx.exam.count()
			const questionCount = await tx.question.count()
			const examSubmit = await tx.examSubmit.findMany({
				where: {
					createdAt: {
						gte: new Date(new Date().setDate(new Date().getDate() - 7))
					}
				}
			})
			const examSubmitCount = examSubmit.length
			const examSubmitByBranch = examSubmit.reduce((acc, curr) => {
				const { studentBranch } = curr
				if (acc[studentBranch]) {
					acc[studentBranch]++
				} else {
					acc[studentBranch] = 1
				}
				return acc
			}, {})
			return {
				examCount,
				questionCount,
				examSubmitCount,
				examSubmitByBranch
			}
		})
	}

	getResult(args: GetResultArgs) {
		const { studentId } = args
		return this.db.examSubmit.findMany({
			where: {
				studentId
			}
		})
	}

	getExams() {
		return this.db.exam.findMany()
	}

	getQuestions(args?: GetQuestionsArgs) {
		const { examId } = args || {}

		return this.db.question.findMany({
			where: {
				...(examId && { examId })
			},
			select: {
				id: true,
				text: true
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
		const { value: storedUsername } = await this.getSetting(
			'ADMIN_USER_USERNAME'
		)
		const { value: storedPassword } = await this.getSetting(
			'ADMIN_USER_PASSWORD'
		)
		if (username === storedUsername && password === storedPassword) {
			return generateToken(JSON.stringify({ username }))
		}
		throw new UnauthorizedException()
	}

	async createExam(args: CreateExamArgs, token) {
		await this.verifyAdmin(token)
		const { name, questions } = args

		return this.db.$transaction(async (tx) => {
			const exist = await tx.exam.findFirst({
				where: {
					name
				}
			})
			if (exist) {
				throw new BadRequestException('Exam already exists')
			}
			const exam = await tx.exam.create({
				data: {
					name
				}
			})
			for (const question of questions) {
				const { text, answer } = question
				await tx.question.create({
					data: {
						id: cuid.slug(),
						examId: exam.id,
						text,
						answer
					}
				})
			}

			return exam
		})
	}

	async updateExam(args: UpdateExamArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args
		try {
			const updatedExam = await this.db.exam.update({
				where: { id: examId },
				data
			})

			return updatedExam
		} catch {
			throw new BadRequestException('Exam not found')
		}
	}

	async deleteExam(args: DeleteExamArgs, token) {
		await this.verifyAdmin(token)
		const { examId } = args
		try {
			await this.db.exam.delete({
				where: { id: examId }
			})

			return true
		} catch {
			throw new BadRequestException('Exam not found')
		}
	}

	async createQuestion(args: CreateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args

		return this.db.$transaction(async (tx) => {
			const exam = await tx.exam.findUnique({
				where: { id: examId },
				select: { id: true }
			})
			if (!exam) {
				throw new BadRequestException('Exam not found')
			}

			return tx.question.create({
				data: {
					id: cuid.slug(),
					examId: exam.id,
					...data
				}
			})
		})
	}

	async updateQuestion(args: UpdateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId, data } = args
		try {
			const updatedQuestion = this.db.question.update({
				where: { id: questionId },
				data
			})

			return updatedQuestion
		} catch {
			throw new BadRequestException('Question not found')
		}
	}

	async deleteQuestion(args: DeleteQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId } = args
		try {
			await this.db.question.delete({
				where: { id: questionId }
			})

			return true
		} catch {
			throw new BadRequestException('Question not found')
		}
	}

	async updateSetting(args: UpdateSettingArgs, token) {
		await this.verifyAdmin(token)
		const { key, value } = args || {}
		if (!key || !value) {
			throw new BadRequestException('Missing key or value')
		}
		try {
			const updatedSetting = this.db.setting.update({
				where: { key },
				data: { value }
			})

			return updatedSetting
		} catch {
			throw new BadRequestException('Setting not found')
		}
	}

	submitExam(args: SubmitExamArgs) {
		const { examId, data } = args || {}
		if (!examId || !data) {
			throw new BadRequestException('Missing examId or data')
		}

		return this.db.$transaction(async (tx) => {
			const { value: passingPercent } = await this.getSetting(
				'EXAM_PASS_PERCENT'
			)
			const existScore = await tx.examSubmit.findMany({
				where: {
					examId,
					studentId: data.studentId
				}
			})
			if (existScore.length > 0) {
				for (const data of existScore) {
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
			if (!questions) {
				throw new BadRequestException('Exam not found')
			}
			if (questions.length !== data.answers.length) {
				throw new BadRequestException('Missing answer')
			}
			for (const question of questions) {
				const studentAnswer = data.answers.find(
					(answer) => answer.questionId === question.id
				)
				if (studentAnswer && studentAnswer.answer === question.answer) {
					point++
				}
			}
			const passed = point / questions.length >= +passingPercent / 100

			return tx.examSubmit.create({
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
		})
	}
}
