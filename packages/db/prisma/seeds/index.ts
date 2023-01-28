import { seedSettings } from './setting.seed'
import { PrismaClient } from '../../generated/client'

const db = new PrismaClient()

;(async () => {
	console.log('\n🔞 Seeding settings...')
	await seedSettings(db)
	console.log('✅ Done')
})()
	.then(async () => {
		console.log('\n⛩️ Seeder disconnected')
		await db.$disconnect()
	})
	.catch(async (e) => {
		console.error(e)
		await db.$disconnect()
		process.exit(1)
	})
