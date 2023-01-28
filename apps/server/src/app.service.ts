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
import { GetQuestionsArgs } from './public/public.dto'

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

		return true
	}

	async updateExam(args: UpdateExamArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args
		await this.db.exam.update({
			where: { id: examId },
			data
		})

		return true
	}

	async createQuestion(args: CreateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { examId, data } = args
		await this.db.question.create({
			data: {
				examId,
				...data
			}
		})

		return true
	}

	async updateQuestion(args: UpdateQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId, data } = args
		await this.db.question.update({
			where: { id: questionId },
			data
		})

		return true
	}

	async deleteQuestion(args: DeleteQuestionArgs, token) {
		await this.verifyAdmin(token)
		const { questionId } = args
		await this.db.question.delete({
			where: { id: questionId }
		})

		return true
	}
}
