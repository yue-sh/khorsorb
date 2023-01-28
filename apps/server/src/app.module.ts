import { PrismaService } from '@exam/db'
import { Module } from '@nestjs/common'

import { AdminController } from './admin/admin.controller'
import { AppService } from './app.service'
import { PublicController } from './public/public.controller'

@Module({
	controllers: [AdminController, PublicController],
	providers: [AppService, PrismaService]
})
export class AppModule {}
