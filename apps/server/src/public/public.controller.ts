import { Controller, Get, Query } from '@nestjs/common'

import { GetQuestionsArgs } from './public.dto'
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
}
