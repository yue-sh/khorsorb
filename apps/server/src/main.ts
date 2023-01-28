import { SERVER_HOST, SERVER_PORT, isDevelopment } from '@exam/core'
import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import {
	FastifyAdapter,
	NestFastifyApplication
} from '@nestjs/platform-fastify'

import { AppModule } from './app.module'
//
;(async () => {
	const logger = new Logger('Exam')
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ bodyLimit: 33554432 }),
		{
			bodyParser: true,
			cors: { origin: '*' },
			logger: isDevelopment ? ['error', 'warn', 'log'] : ['error']
		}
	)

	await app.listen(SERVER_PORT, SERVER_HOST)

	logger.log('Server initalized \n')
})()
