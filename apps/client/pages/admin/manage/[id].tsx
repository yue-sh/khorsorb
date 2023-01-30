import { Editable, EditablePreview, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup, EditableInput, Button, Box, Text, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiAddToQueue, BiTrash } from "react-icons/bi";
import Sidebar from "../../../layouts/default";
import { ENDPOINT_URL } from "../../../libs/utils";

function QuestionCard({ data, reload }: any) {
	const [editData, setEditData] = useState(data)
	const [isLoading, setIsLoading] = useState(false)
	const saveQuestionChanges = () => {
		fetch(ENDPOINT_URL + `/v1/admin/question/update`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + document.cookie.split('=')[1]
			},
			body: JSON.stringify({ questionId: editData.id, data: editData })
		})
		reload()
	}
	const onDelelteButtonClick = () => {
		setIsLoading(true)
		fetch(ENDPOINT_URL + `/v1/admin/question/delete`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + document.cookie.split('=')[1]
			},
			body: JSON.stringify({ questionId: editData.id })
		}).then(() => {
			setTimeout(() => {
				setIsLoading(false)
				reload()
			}, 100)
		})
	}

	return (
		<Box bg="white" p="8" rounded="md" boxShadow="md" mb="4">
			<Editable value={editData.text} onChange={
				(value) => {
					setEditData({
						...editData,
						text: value
					})
				}
			}
				onSubmit={() => {
					saveQuestionChanges()
				}
				}
			>
				<EditablePreview />
				<EditableInput />
			</Editable>
			<Box mt="4">
				<RadioGroup colorScheme="green" value={editData.answer ? "0" : "1"} onChange={
					(value) => {
						setEditData({
							...editData,
							answer: value === '0' ? true : false
						})
						saveQuestionChanges()
					}
				}>
					<Stack direction="row" spacing="64px">
						<Stack direction="row">
							<Radio value="1" />
							<Editable value={editData.choice1} onChange={
								(value) => {
									setEditData({
										...editData,
										choice1: value
									})
								}
							}
								onSubmit={() => {
									saveQuestionChanges()
								}
								}
							>
								<EditablePreview />
								<EditableInput />
							</Editable>
						</Stack>
						<Stack direction="row">
							<Radio value="0" />
							<Editable value={editData.choice2} onChange={
								(value) => {
									setEditData({
										...editData,
										choice2: value
									})
								}
							}
								onSubmit={() => {
									saveQuestionChanges()
								}
								}
							>
								<EditablePreview />
								<EditableInput />
							</Editable>
						</Stack>
					</Stack>
				</RadioGroup>
			</Box>
			<Box textAlign="right">
				<Popover>
					<PopoverTrigger>
						<Button colorScheme="red" size="sm" leftIcon={<BiTrash />}>
							ลบคำถามนี้
						</Button>
					</PopoverTrigger>
					<PopoverContent textAlign="left">
						<PopoverHeader fontWeight='semibold'>ลบ</PopoverHeader>
						<PopoverArrow />
						<PopoverCloseButton />
						<PopoverBody>
							คุณต้องการลบคำถามชุดนี้ใช่หรือไม่
						</PopoverBody>
						<PopoverFooter display='flex' justifyContent='flex-end'>
							<ButtonGroup size='sm'>
								<Button isLoading={isLoading} variant='outline'>ยกเลิก</Button>
								<Button isLoading={isLoading} onClick={onDelelteButtonClick} colorScheme='red'>ลบ</Button>
							</ButtonGroup>
						</PopoverFooter>
					</PopoverContent>
				</Popover>
			</Box>
		</Box>
	)
}

function ManagePage() {
	const [AllQuestions, setAllQuestions] = useState([] as any[])
	const [isLoading, setIsLoading] = useState(false)
	const [examId, setExamId] = useState('none')
	const router = useRouter()
	const loadAllQuestions = () => {
		if (typeof examId == 'undefined') return
		setIsLoading(true)
		fetch(ENDPOINT_URL + `/v1/admin/exam/questions?examId=${router.query.id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + document.cookie.split('=')[1]
			}
		}).then(res => res.json()).then(data => {
			setAllQuestions(data)
			setIsLoading(false)
		})
	}
	useEffect(() => {
		if (!router.query.id) return
		console.log(router.query.id)
		setExamId(router.query.id as string)
		loadAllQuestions()
	}, [router.isReady, router.query.id])

	const onCreateQuestionClick = () => {
		setIsLoading(true)
		fetch(ENDPOINT_URL + `/v1/admin/question/create`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + document.cookie.split('=')[1]
			},
			body: JSON.stringify({
				examId: examId,
				data: {
					text: 'คำถามใหม่',
					choice1: 'คำตอบที่ 1',
					choice2: 'คำตอบที่ 2',
					answer: true
				}
			})
		}).then(res => res.json()).then(() => {
			loadAllQuestions()
		})
	}
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					จัดการชุดทดสอบ
				</Text>
				<Box mb="4" w="full" textAlign="right">
					<Button colorScheme="green" leftIcon={<BiAddToQueue />} isLoading={isLoading} onClick={() => onCreateQuestionClick()}>
						เพิ่มข้อทดสอบ
					</Button>
				</Box>
				{
					AllQuestions.map((question) => {
						return (
							<QuestionCard reload={loadAllQuestions} data={question} key={question.id} />
						)
					})
				}
			</Box>
		</Sidebar>
	);
}
export default ManagePage;
