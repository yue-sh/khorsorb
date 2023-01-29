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

	private generateWeekRange() {
		const startDate = new Date()
		startDate.setDate(startDate.getDate() - startDate.getDay())
		startDate.setHours(0, 0, 0, 0)
		const endDate = new Date()
		endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))
		endDate.setHours(23, 59, 59, 999)

		return { startDate, endDate }
	}

	private addDays(date: Date, days: number) {
		const result = new Date(date)
		result.setDate(result.getDate() + days)
		return result
	}

	private getDates(startDate: Date, stopDate: Date) {
		const dateArray: Date[] = []
		let currentDate = startDate
		while (currentDate <= stopDate) {
			dateArray.push(new Date(currentDate))
			currentDate = this.addDays(currentDate, 1) //currentDate.addDays(1)
		}

		return dateArray
	}

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
			const weeklyExamSubmitCount = await this.getWeeklyExamSubmit()
			return {
				examCount,
				questionCount,
				examSubmitCount,
				examSubmitByBranch,
				weeklyExamSubmitCount
			}
		})
	}

	async getWeeklyExamSubmit(): Promise<number[]> {
		const { startDate, endDate } = this.generateWeekRange()
		const dates = this.getDates(startDate, endDate)
		const examSubmitArray = []
		for (const date of dates) {
			const examSubmit = await this.db.examSubmit.count({
				where: {
					createdAt: {
						gte: date,
						lte: this.addDays(date, 1)
					}
				}
			})
			examSubmitArray.push(examSubmit)
		}

		return examSubmitArray
	}

	getResult(args: GetResultArgs) {
		const { studentId } = args
		if (!studentId) {
			throw new BadRequestException('Missing studentId')
		}
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

	async getAdminResults(token, args?: GetAnswersArgs) {
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
			throw new UnauthorizedException('Missing username or password')
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

	createExam(args: CreateExamArgs, token) {
		const { name, questions } = args
		if (!name || !questions) {
			throw new BadRequestException('Missing name or questions')
		}

		return this.db.$transaction(async (tx) => {
			await this.verifyAdmin(token)
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

	updateExam(args: UpdateExamArgs, token) {
		const { examId, data } = args || {}
		if (!examId || !data) {
			throw new BadRequestException('Missing examId or data')
		}
		try {
			return this.db.$transaction(async (tx) => {
				await this.verifyAdmin(token)
				const updatedExam = await tx.exam.update({
					where: { id: examId },
					data
				})

				return updatedExam
			})
		} catch {
			throw new BadRequestException('Exam not found')
		}
	}

	deleteExam(args: DeleteExamArgs, token) {
		const { examId } = args
		if (!examId) {
			throw new BadRequestException('Missing examId')
		}
		try {
			return this.db.$transaction(async (tx) => {
				await this.verifyAdmin(token)
				await tx.exam.delete({
					where: { id: examId }
				})

				return true
			})
		} catch {
			throw new BadRequestException('Exam not found')
		}
	}

	createQuestion(args: CreateQuestionArgs, token) {
		const { examId, data } = args || {}
		if (!examId || !data) {
			throw new BadRequestException('Missing examId or data')
		}
		return this.db.$transaction(async (tx) => {
			await this.verifyAdmin(token)
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

	updateQuestion(args: UpdateQuestionArgs, token) {
		try {
			return this.db.$transaction(async (tx) => {
				await this.verifyAdmin(token)
				const { questionId, data } = args
				const updatedQuestion = tx.question.update({
					where: { id: questionId },
					data
				})

				return updatedQuestion
			})
		} catch {
			throw new BadRequestException('Question not found')
		}
	}

	deleteQuestion(args: DeleteQuestionArgs, token) {
		try {
			return this.db.$transaction(async (tx) => {
				await this.verifyAdmin(token)
				const { questionId } = args
				await tx.question.delete({
					where: { id: questionId }
				})

				return true
			})
		} catch {
			throw new BadRequestException('Question not found')
		}
	}

	updateSetting(args: UpdateSettingArgs, token) {
		try {
			return this.db.$transaction(async (tx) => {
				await this.verifyAdmin(token)
				const { key, value } = args || {}
				if (!key || !value) {
					throw new BadRequestException('Missing key or value')
				}
				const updatedSetting = tx.setting.update({
					where: { key },
					data: { value }
				})

				return updatedSetting
			})
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
			const originalAnswers = await tx.question.findMany({
				where: { examId },
				select: {
					id: true,
					text: true,
					answer: true
				}
			})
			const mappedOriginalAnswers = originalAnswers.map((answer) => ({
				questionId: answer.id,
				text: answer.text,
				answer: answer.answer
			}))

			return tx.examSubmit.create({
				data: {
					examId,
					studentId: data.studentId,
					studentName: data.studentName,
					studentBranch: data.studentBranch,
					originalAnswers: JSON.stringify(mappedOriginalAnswers),
					answers: JSON.stringify(data.answers),
					point
				}
			})
		})
	}
}
