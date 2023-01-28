export class GetQuestionsArgs {
	examId: string
}

class ExamAnswer {
	questionId: string
	answer: boolean
}

export class SubmitAnswerArgs {
	examId: string
	data: {
		studentId: string
		studentName: string
		studentBranch: string
		answers: ExamAnswer[]
	}
}
