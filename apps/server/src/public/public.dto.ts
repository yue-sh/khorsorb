export class GetResultArgs {
	studentId: string
}

export class GetQuestionsArgs {
	examId: string
}

class ExamAnswer {
	questionId: string
	answer: boolean
}

export class SubmitExamArgs {
	examId: string
	groupId: string
	data: {
		answers: ExamAnswer[]
	}
}

export class CreateGroupArgs {
	studentId: string
	studentName: string
	studentBranch: string
}
