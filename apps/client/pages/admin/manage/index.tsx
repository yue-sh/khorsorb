import { Modal, ModalOverlay, Button, ModalHeader, ModalCloseButton, ModalFooter, ModalContent, ModalBody, Box, Text, Table, Tr, Th, Thead, TableCaption, Tbody, Td, IconButton, Collapse, Grid, GridItem, RadioGroup, Stack, Radio, Input, Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverArrow, PopoverCloseButton, PopoverBody, PopoverFooter, ButtonGroup } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiEdit, BiSearch, BiTrash } from "react-icons/bi";
import Sidebar from "../../../layouts/default";
import { ENDPOINT_URL } from "../../../libs/utils";
function TesterPage() {
	const [modalContent, setModalContent] = useState(null as any);
	const [newExam, setNewExam] = useState('')
	const [isLoading, setIsLoading] = useState(false);
	const [exams, setExams] = useState([] as any[]);
	const [setDelete, setSetDelete] = useState('');
	const router = useRouter();
	const loadList = () => {
		fetch(ENDPOINT_URL + '/v1/public/exams',
			{
				method: 'GET',
			}
		).then(res => res.json())
			.then(res => {
				setExams(res)
				console.log(res);
			}
			);
	}

	useEffect(() => {
		loadList()
	}, []);

	const onCreateButtonClick = () => {
		setIsLoading(true);
		setModalContent(null);
		fetch(ENDPOINT_URL + '/v1/admin/exam/create',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + document.cookie.split('=')[1]
				},
				body: JSON.stringify({
					name: newExam,
					questions: []
				})
			}
		).then(res => res.json())
			.then(res => {
				console.log('exam', res)
				router.push('/admin/manage/' + res.exam.id)
				setIsLoading(false)
				setNewExam('')
				// loadList()
			}
			);
	}

	const onDelelteButtonClick = () => {
		setIsLoading(true);
		setModalContent(null);
		fetch(ENDPOINT_URL + '/v1/admin/exam/delete',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': 'Bearer ' + document.cookie.split('=')[1]
				},
				body: JSON.stringify({
					examId: setDelete
				})
			}
		).then(res => res.json())
			.then(res => {
				console.log('exam', res)
				setIsLoading(false)
				setNewExam('')
				setSetDelete('')
				loadList()
			}
			);
	}
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					จัดการชุดแบบทดสอบ
				</Text>
				<Modal size="xl" onClose={() => (setModalContent(null))} isOpen={!!modalContent} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>สร้างชุดแบบทดสอบใหม่</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Box>
								<Box>
									<Text >
										ชื่อชุดแบบทดสอบ
									</Text>
									<Box>
										<Input onChange={(e) => setNewExam(e.target.value)} value={newExam} />
									</Box>
								</Box>
							</Box>
						</ModalBody>
						<ModalFooter>
							<Button isLoading={isLoading} onClick={() => (setModalContent(null))}>ยกเลิก</Button>
							<Button isLoading={isLoading} onClick={() => {
								if (newExam === '') return;
								onCreateButtonClick()
							}} colorScheme="teal" ml={3}>สร้าง</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Box bg="white" p="4" rounded="md" boxShadow="md">
					<Box display="flex" justifyContent="flex-end">
						<Button isLoading={isLoading} onClick={() => setModalContent(2)} colorScheme="green" leftIcon={<BiEdit />}>เพิ่มชุดแบบทดสอบใหม่</Button>
					</Box>
					<Table variant='simple'>
						<TableCaption>ทั้งหมด {exams.length} ชุด</TableCaption>
						<Thead>
							<Tr>
								<Th>รหัส</Th>
								<Th>ชื่อ</Th>
								<Th>จำนวนข้อ</Th>
								<Th>จัดการ</Th>
							</Tr>
						</Thead>
						<Tbody>
							{exams?.length && exams?.map((exam) => {
								return (
									<Tr key={exam.id}>
										<Td>{exam.id.toString().slice(-6)}</Td>
										<Td>{exam.name}</Td>
										<Td>{exam.questionCount}</Td>
										<Td>
											<Stack direction="row">
												<IconButton isLoading={isLoading} onClick={() => router.push('/admin/manage/' + exam.id)} colorScheme="blue" aria-label="ตรวจสอบ" icon={<BiEdit />} />
												<Popover
													returnFocusOnClose={false}
													isOpen={setDelete == exam.id}
													onClose={() => setSetDelete('')}
													placement='right'
													closeOnBlur={false}
												>
													<PopoverTrigger>
														<IconButton isLoading={isLoading} onClick={() => setSetDelete(exam.id)} colorScheme="red" aria-label="ลบ" icon={<BiTrash />} />
													</PopoverTrigger>
													<PopoverContent>
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
											</Stack>
										</Td>
									</Tr>
								)
							})
							}
						</Tbody>
					</Table>
				</Box>
			</Box>
		</Sidebar>
	);
}
export default TesterPage;
