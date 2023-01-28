export class GetResultArgs {
	studentId: string
}

export class GetQuestionsArgs {
	examId: string
}

class ExamAnswer {
	questionId: string
	text: string
	answer: boolean
}

export class SubmitExamArgs {
	examId: string
	data: {
		studentId: string
		studentName: string
		studentBranch: string
		answers: ExamAnswer[]
	}
}
