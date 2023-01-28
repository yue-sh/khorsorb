import { PrismaService } from '@exam/db'
import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
	constructor(private readonly db: PrismaService) {}
}
