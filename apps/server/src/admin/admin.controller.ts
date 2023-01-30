import { Controller, Post, Headers, Body, Get, Query } from '@nestjs/common'

import {
	AdminLoginArgs,
	CreateExamArgs,
	UpdateExamArgs,
	CreateQuestionArgs,
	UpdateQuestionArgs,
	DeleteQuestionArgs,
	UpdateSettingArgs,
	DeleteExamArgs,
	UpdateGroupArgs,
	DeleteGroupArgs
} from './admin.dto'
import { AppService } from '../app.service'
import { GetQuestionsArgs } from '../public/public.dto'

@Controller('/v1/admin')
export class AdminController {
	constructor(private readonly service: AppService) {}

	@Get('/stats')
	getStats(@Headers('Authorization') token) {
		return this.service.getStats(token)
	}

	@Get('/results')
	getAdminResults(@Headers('Authorization') token) {
		return this.service.getAdminResults(token)
	}

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

	@Post('/exam/delete')
	deleteExam(@Body() args: DeleteExamArgs, @Headers('Authorization') token) {
		return this.service.deleteExam(args, token)
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

	@Post('/setting/update')
	updateSetting(
		@Body() args: UpdateSettingArgs,
		@Headers('Authorization') token
	) {
		return this.service.updateSetting(args, token)
	}

	@Get('/exam/questions')
	getAdminQuestions(
		@Headers('Authorization') token,
		@Query() args?: GetQuestionsArgs
	) {
		return this.service.getAdminQuestions(token, args)
	}

	@Post('/group/update')
	updateGroup(@Body() args: UpdateGroupArgs, @Headers('Authorization') token) {
		return this.service.updateGroup(args, token)
	}

	@Post('/group/delete')
	deleteGroup(@Body() args: DeleteGroupArgs, @Headers('Authorization') token) {
		return this.service.deleteGroup(args, token)
	}
}
