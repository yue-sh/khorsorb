import { Controller, Post, Headers, Body } from '@nestjs/common'

import {
	AdminLoginArgs,
	CreateExamArgs,
	UpdateExamArgs,
	CreateQuestionArgs,
	UpdateQuestionArgs,
	DeleteQuestionArgs
} from './admin.dto'
import { AppService } from '../app.service'

@Controller('/v1/admin')
export class AdminController {
	constructor(private readonly service: AppService) {}

	@Post('/login')
	adminLogin(@Body() args: AdminLoginArgs) {
		return this.service.login(args)
	}

	@Post('/exam/create')
	createExam(@Body() args: CreateExamArgs, @Headers('Authorization') token) {
		return this.service.createExam(args, token)
	}

	@Post('/exam/update')
	updateExam(@Body() args: UpdateExamArgs, @Headers('Authorization') token) {
		return this.service.updateExam(args, token)
	}

	@Post('/question/create')
	createQuestion(
		@Body() args: CreateQuestionArgs,
		@Headers('Authorization') token
	) {
		return this.service.createQuestion(args, token)
	}

	@Post('/question/update')
	updateQuestion(
		@Body() args: UpdateQuestionArgs,
		@Headers('Authorization') token
	) {
		return this.service.updateQuestion(args, token)
	}

	@Post('/question/delete')
	deleteQuestion(
		@Body() args: DeleteQuestionArgs,
		@Headers('Authorization') token
	) {
		return this.service.deleteQuestion(args, token)
	}
}
