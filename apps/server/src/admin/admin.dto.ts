export class GetAnswersArgs {
	examId: string
}

export class AdminLoginArgs {
	username: string
	password: string
}

class ExamQuestions {
	text: string
	answer: boolean
	choice1: string
	choice2: string
}

export class CreateExamArgs {
	name: string
	questions?: ExamQuestions[]
}

export class UpdateExamArgs {
	examId: string
	data?: {
		name: string
	}
}

export class DeleteExamArgs {
	examId: string
}

export class CreateQuestionArgs {
	examId: string
	data: {
		choice1: string
		choice2: string
		text: string
		answer: boolean
	}
}

export class UpdateQuestionArgs {
	questionId: string
	data: {
		choice1?: string
		choice2?: string
		text?: string
		answer?: boolean
	}
}

export class DeleteQuestionArgs {
	questionId: string
}

export class UpdateSettingArgs {
	key: string
	value: string
}
