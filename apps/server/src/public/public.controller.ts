import { Controller, Get, Query, Post, Body } from '@nestjs/common'

import { GetQuestionsArgs, SubmitExamArgs } from './public.dto'
import { AppService } from '../app.service'

@Controller('/v1/public')
export class PublicController {
	constructor(private readonly service: AppService) {}

	@Get('/exams')
	getExams() {
		return this.service.getExams()
	}

	@Get('/questions')
	getQuestions(@Query() args?: GetQuestionsArgs) {
		return this.service.getQuestions(args)
	}

	@Post('/exam/submit')
	submitExam(@Body() args: SubmitExamArgs) {
		return this.service.submitExam(args)
	}
}
