import { Controller } from '@nestjs/common'

import { AppService } from '../app.service'

@Controller('/v1/admin')
export class PublicController {
	constructor(private readonly service: AppService) {}
}
