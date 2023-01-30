import {
	Card,
	ScaleFade,
	Text,
	Grid,
	GridItem,
	Container,
	Box,
	Flex,
	Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BiCheck } from 'react-icons/bi'
import { ENDPOINT_URL } from '../libs/utils'

function QuestionCard({ questionData, index, onQuestionChange }: any) {
	const [selectChoice, setSelectChoice] = useState(-1)
	return (
		<Card p={5} shadow="md" boxShadow="lg" border="1px" borderColor="gray.200" mb="2">
			<Box><Text fontWeight="bold">ข้อที่ {index}.</Text> <Text fontSize="xl">{questionData?.text}</Text></Box>
			<Box border="1px" mt="2" borderColor="gray.300" p="2" cursor="pointer" rounded="md" transition="0.3s" onClick={() => {
				setSelectChoice(0)
				onQuestionChange({
					id: questionData.id,
					answer: true,
					examId: questionData.examId
				})
			}} color={(selectChoice == 0 && 'white') || ''} bg={(selectChoice == 0 && 'green.400') || ''}>
				<Flex justifyContent="space-between">
					<Box>
						{questionData.choice1}
					</Box>
					<Box fontSize="2xl">
						{selectChoice == 0 && <BiCheck />}
					</Box>
				</Flex>
			</Box>
			<Box border="1px" mt="2" borderColor="gray.300" p="2" cursor="pointer" rounded="md" transition="0.3s" onClick={() => {
				setSelectChoice(1)
				onQuestionChange({
					id: questionData.id,
					answer: false,
					examId: questionData.examId
				})
			}} color={(selectChoice == 1) ? 'white' : ''} bg={(selectChoice == 1) ? 'green.400' : ''}>
				<Flex justifyContent="space-between">
					<Box>
						{questionData.choice2}
					</Box>
					<Box fontSize="2xl">
						{selectChoice == 1 && <BiCheck />}
					</Box>
				</Flex>
			</Box>
		</Card>

	)
}
function IndexPage() {
	const [questions, setQuestions] = useState([] as any[])
	const [answersList, setAnswersList] = useState([] as any[])
	const [isLoading, setIsLoading] = useState(false)
	const [testerData, setTesterData] = useState(null as any)
	const router = useRouter()
	const loadAllQuestions = async () => {
		const res = await fetch(ENDPOINT_URL + '/v1/public/questions')
		const data = await res.json()
		setQuestions(data.sort(() => Math.random() - 0.5))
	}

	const submitExam = async (groupId: string, examData: any) => {
		return await new Promise((resolve) => {
			fetch(ENDPOINT_URL + '/v1/public/exam/submit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					groupId: groupId,
					examId: examData.examId,
					data: {
						answers: examData.answers.map((answer: any) => {
							return {
								questionId: answer.id,
								answer: answer.answer
							}
						})
					}
				})
			}).then(async (res) => {
				const data = await res.json()
				resolve(data)
			})
		})
	}

	const onSubmitButtonClick = () => {
		//Create group and submit answer
		if (isLoading) return
		setIsLoading(true)
		fetch(ENDPOINT_URL + '/v1/public/group/create', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(testerData)
		}).then(async (res) => {
			const data = await res.json()
			const groupId = data.id
			const examList = [] as any[]
			//Group up exam id
			answersList.forEach((answer: any) => {
				const index = examList.findIndex((exam: any) => {
					return exam.examId == answer.examId
				})
				if (index == -1) {
					examList.push({
						examId: answer.examId,
						answers: [answer]
					})
				} else {
					examList[index].answers.push(answer)
				}
			})
			console.log('examList', examList)
			const submitPromises = [] as any[]
			for (const exam of examList) {
				console.log('exam', exam)
				submitPromises.push(submitExam(groupId, exam))
			}
			await Promise.all(submitPromises).then((data) => {
				console.log('submit data', data)
				const dataQuery = data.map((exam: any) => {
					return exam.examSubmit
				})
				router.push(`/result?data=${btoa(JSON.stringify({
					tester: testerData,
					list: dataQuery
				}))}`)
			})
			setIsLoading(false)
		})
	}

	const onQuestionChange = (data: any) => {
		const index = answersList.findIndex((answer: any) => {
			return answer.id == data.id
		})
		if (index == -1) {
			setAnswersList([...answersList, data])
		} else {
			answersList[index] = data
			setAnswersList([...answersList])
		}
		console.log('ans', answersList)
	}


	useEffect(() => {
		if (!router.isReady) return
		loadAllQuestions()
		const { data } = router.query
		if (data) {
			try {
				setTesterData(JSON.parse(atob(data as string)))
				return
			} catch (e) {
				console.log('tester data error', e)
			}
		}
		router.push('/')
	}, [router.isReady])

	return (
		<ScaleFade initialScale={0.95} in={true}>
			<Container mt="14" maxW="6xl">
				<Box>
					<Text fontSize="4xl" fontWeight="bold">แบบทดสอบ</Text>
				</Box>
				<Grid
					gap={4}
					templateColumns={
						"repeat(auto-fill, minmax(400px, 1fr))"
					}
				>
					{
						questions.map((question: any, index: number) => {
							return <GridItem key={question.id}><QuestionCard index={index + 1} onQuestionChange={onQuestionChange} questionData={question} /></GridItem>
						})
					}
				</Grid>
				<Flex justifyContent="center" mt="4" mb="16">
					<Button isDisabled={
						answersList.length != questions.length
					} colorScheme="green" size="lg" isLoading={isLoading} onClick={onSubmitButtonClick} leftIcon={<BiCheck />}>ส่งคำตอบ</Button>
				</Flex>
			</Container>
		</ScaleFade>
	)
}
export default IndexPage
