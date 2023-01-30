import { Modal, ModalOverlay, Button, StatHelpText, Stat, StatLabel, StatNumber, ModalHeader, ModalCloseButton, ModalFooter, ModalContent, ModalBody, Box, Text, Table, Tr, Th, Thead, TableCaption, Tbody, Td, IconButton, Collapse, Grid, GridItem, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Sidebar from "../../layouts/default";
import { ENDPOINT_URL } from "../../libs/utils";

function AnswerCard({ data }: any) {
	const answers = JSON.parse(data.answers)
	const originalAnswers = JSON.parse(data.originalAnswers)
	const [totalPoints, setTotalPoints] = useState(0)
	const [totalQuestions, setTotalQuestions] = useState(0)
	let tempTotalPoints = 0
	for (const oa of originalAnswers) {
		const answer = answers.find((a: any) => a.questionId === oa.questionId)
		if (answer) {
			if (answer.answer === oa.answer) {
				tempTotalPoints += 1
			}
		}
	}
	useEffect(() => {
		setTotalPoints(tempTotalPoints)
		setTotalQuestions(originalAnswers.length)
	}, [tempTotalPoints])
	return (
		<Box
			p='40px'
			color='black'
			border="1px"
			borderColor="gray.400"
			mt='1'
			bg='white'
			rounded='md'
			shadow='md'
		>
			<Grid templateColumns="repeat(4, 1fr)" gap={6}>
				<GridItem >
					<Stat>
						<StatLabel>ทั้งหมด</StatLabel>
						<StatNumber>{totalQuestions}</StatNumber>
						<StatHelpText>ข้อ</StatHelpText>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatLabel>ตอบถูก</StatLabel>
						<StatNumber>{totalPoints}</StatNumber>
						<StatHelpText>ข้อ</StatHelpText>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatLabel>ตอบผิด</StatLabel>
						<StatNumber>{
							totalQuestions - totalPoints
						}</StatNumber>
						<StatHelpText>ข้อ</StatHelpText>
					</Stat>
				</GridItem>
				<GridItem>
					<Stat>
						<StatLabel>ทำคะแนนได้</StatLabel>
						<StatNumber>{
							Math.round((totalPoints / totalQuestions) * 100)
						}</StatNumber>
						<StatHelpText>%</StatHelpText>
					</Stat>
				</GridItem>
			</Grid>
			<Box>
				<Text mt="4" fontSize="xl" fontWeight="bold">
					รายละเอียดการสอบ
				</Text>
			</Box>
			<Table variant='simple' mt="2">
				<Thead>
					<Tr>
						<Th>ข้อที่</Th>
						<Th>คำถาม</Th>
						<Th>คำตอบ</Th>
					</Tr>
				</Thead>
				<Tbody>
					{
						originalAnswers.map((item: any, index: number) => {
							return (
								<Tr key={index} bg={
									answers.find((a: any) => a.questionId === item.questionId).answer === item.answer ? 'green.100' : 'red.100'
								}>
									<Td>{
										index + 1
									}</Td>
									<Td>{
										item.text
									}</Td>
									<Td>
										<RadioGroup value={
											answers.find((a: any) => a.questionId === item.questionId).answer === item.answer ? '1' : '2'
										}>
											<Stack spacing="16px" direction="row">
												<Radio value="1">{
													item.choice1
												}</Radio>
												<Radio value="2">{
													item.choice2
												}</Radio>
											</Stack>
										</RadioGroup>
									</Td>
								</Tr>
							)
						})
					}
				</Tbody>
			</Table>
		</Box>
	)
}

function TesterPage() {
	const [modalContent, setModalContent] = useState('');
	const [targetCollapse, setTargetCollapse] = useState('');
	const [history, setHistory] = useState([])
	const [displayData, setDisplayData] = useState({} as any)
	useEffect(() => {
		fetch(ENDPOINT_URL + '/v1/admin/results', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + document.cookie.split('=')[1]
			}
		}).then(res => res.json()).then(res => {
			setHistory(res.filter((item: any) => item.submits.length > 0).sort(
				(a: any, b: any) => {
					const dateA = new Date(a.createdAt);
					const dateB = new Date(b.createdAt);
					return dateB.getTime() - dateA.getTime()
				}
			))
		})
	}, []);
	useEffect(() => {
		if (modalContent) {
			setDisplayData(history.find((item: any) => item.id == modalContent))
		}
	}, [modalContent])
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					รายชื่อผู้ทำแบบทดสอบ
				</Text>
				<Modal size="xl" onClose={() => (setModalContent(''), setTargetCollapse(''))} isOpen={!!modalContent} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>ข้อมูลผู้เข้าสอบ</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Box bg="#e6e8ed" fontWeight="bold" textAlign="center" p="4" rounded="md" boxShadow="md">
								<Text>หมายเลขนักศึกษา: {displayData.studentId}</Text>
								<Text>ผู้สอบ: {displayData.studentName}</Text>
								<Text>สาขา: {displayData.studentBranch}</Text>
								<Text>จำนวนข้อทั้งหมด {
									displayData?.submits?.reduce((acc: number, item: any) => acc + JSON.parse(item.originalAnswers).length, 0)
								} ข้อ</Text>
								<Text>จำนวนข้อที่ทำได้ {
									displayData?.submits?.reduce((acc: number, item: any) => acc + JSON.parse(item.answers).filter((a: any) => a.answer === JSON.parse(item.originalAnswers).find((b: any) => b.questionId === a.questionId).answer).length, 0)
								} ข้อ</Text>
								<Text>คิดเป็น {
									Math.round(displayData?.submits?.reduce((acc: number, item: any) => acc + JSON.parse(item.answers).filter((a: any) => a.answer === JSON.parse(item.originalAnswers).find((b: any) => b.questionId === a.questionId).answer).length, 0) / displayData?.submits?.reduce((acc: number, item: any) => acc + JSON.parse(item.originalAnswers).length, 0) * 100)
								}%</Text>
							</Box>
							<Text mt="4" fontSize="xl" fontWeight="bold">
								รายการสอบ
							</Text>
							{
								displayData?.submits?.map((item: any, index: number) => (
									<Box key={index} mb="2">
										<Box onClick={() => targetCollapse == item.id ? setTargetCollapse('') : setTargetCollapse(item.id)} cursor="pointer" bg="green.400" color="white" textAlign="center" fontWeight="bold" p="4" rounded="md">
											{item.examName || 'ไม่มีชื่อแบบทดสอบ'} | {item.point} / {
												JSON.parse(item.originalAnswers).length
											} คะแนน
										</Box>
										<Collapse in={targetCollapse == item.id} animateOpacity>
											<AnswerCard data={item} />
										</Collapse>
									</Box>
								)
								)}
						</ModalBody>
						<ModalFooter>
							<Button onClick={() => (setModalContent(''), setTargetCollapse(''))}>ปิด</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Box bg="white" p="4" rounded="md" boxShadow="md">
					<Table variant='simple'>
						<TableCaption>ทั้งหมด {history.length} ผู้ทำแบบทดสอบ</TableCaption>
						<Thead>
							<Tr>
								<Th>วันที่</Th>
								<Th>รหัสนักศึกษา</Th>
								<Th>ชื่อ</Th>
								<Th>สาขา</Th>
								<Th>คะแนน</Th>
								<Th>ตรวจสอบ</Th>
							</Tr>
						</Thead>
						<Tbody>
							{
								history.map((item: any, index) => (
									<Tr key={index}>
										<Td>{
											new Date(item.createdAt).toLocaleString('th-TH', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: 'numeric',
												minute: 'numeric',
												second: 'numeric'
											})
										}</Td>
										<Td>{item.studentId}</Td>
										<Td>{item.studentName}</Td>
										<Td>{item.studentBranch}</Td>
										<Td>
											{
												//Total point
												item.submits.reduce((total: number, current: any) => {
													return total + current.point;
												}
													, 0)
											} / {
												//Total question
												item.submits.reduce((total: number, current: any) => {
													return total + JSON.parse(current.originalAnswers).length;
												}
													, 0)
											}
										</Td>
										<Td>
											<IconButton onClick={() => setModalContent(item.id)} colorScheme="blue" aria-label="ตรวจสอบ" icon={<BiSearch />} />
										</Td>
									</Tr>
								))
							}
						</Tbody>
					</Table>
				</Box>
			</Box>
		</Sidebar>
	);
}
export default TesterPage;
