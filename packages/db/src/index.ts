import 'dotenv/config'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common'

import { PrismaClient } from '../generated/client'
import type * as PrismaTypes from '../generated/client'

@Injectable()
class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	async onModuleInit() {
		await this.$connect()
	}

	async onModuleDestroy() {
		await this.$disconnect()
	}
}

export { PrismaTypes, PrismaService, PrismaClient }
