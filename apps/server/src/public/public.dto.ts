export class GetQuestionsArgs {
	examId: string
}

export class SubmitAnswerArgs {
	studentId: string
	studentName: string
	studentBranch: string
	answers: JSON
}
