import { Modal, ModalOverlay, Button, StatHelpText, Stat, StatLabel, StatNumber, ModalHeader, ModalCloseButton, ModalFooter, ModalContent, ModalBody, Box, Text, Table, Tr, Th, Thead, TableCaption, Tbody, Td, IconButton, Collapse, Grid, GridItem, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
import Sidebar from "../../layouts/default";
function TesterPage() {
	const [modalContent, setModalContent] = useState(null);
	const [targetCollapse, setTargetCollapse] = useState(null);
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					รายชื่อผู้ทำแบบทดสอบ
				</Text>
				<Modal size="xl" onClose={() => (setModalContent(null), setTargetCollapse(null))} isOpen={!!modalContent} isCentered>
					<ModalOverlay />
					<ModalContent>
						<ModalHeader>ข้อมูลผู้เข้าสอบ</ModalHeader>
						<ModalCloseButton />
						<ModalBody>
							<Box bg="#e6e8ed" fontWeight="bold" textAlign="center" p="4" rounded="md" boxShadow="md">
								<Text>หมายเลขนักศึกษา: 62130500001</Text>
								<Text>ผู้สอบ: นาย ภาณุพงศ์ พรหมสุข</Text>
								<Text>สาขา: ITS</Text>
							</Box>
							<Text mt="4" fontSize="xl" fontWeight="bold">
								รายการสอบ
							</Text>
							<Box onClick={() => targetCollapse == 1 ? setTargetCollapse(null) : setTargetCollapse(1)} cursor="pointer" bg="green.400" color="white" textAlign="center" fontWeight="bold" p="4" rounded="md">
								วันที่ 1/1/2564 | คะแนน 6
							</Box>
							<Collapse in={targetCollapse == 1} animateOpacity>
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
												<StatLabel>ข้อสอบทั้งหมด</StatLabel>
												<StatNumber>6</StatNumber>
												<StatHelpText>ข้อ</StatHelpText>
											</Stat>
										</GridItem>
										<GridItem>
											<Stat>
												<StatLabel>ตอบถูก</StatLabel>
												<StatNumber>6</StatNumber>
												<StatHelpText>ข้อ</StatHelpText>
											</Stat>
										</GridItem>
										<GridItem>
											<Stat>
												<StatLabel>ตอบผิด</StatLabel>
												<StatNumber>4</StatNumber>
												<StatHelpText>ข้อ</StatHelpText>
											</Stat>
										</GridItem>
										<GridItem>
											<Stat>
												<StatLabel>ทำคะแนนได้</StatLabel>
												<StatNumber>50</StatNumber>
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
											<Tr bg="red.100">
												<Td>1</Td>
												<Td>คำถาม 1</Td>
												<Td>
													<RadioGroup defaultValue="1">
														<Stack spacing="16px" direction="row">
															<Radio value="1">จริง</Radio>
															<Radio value="2">เท็จ</Radio>
														</Stack>
													</RadioGroup>
												</Td>
											</Tr>
											<Tr bg="green.100">
												<Td>2</Td>
												<Td>คำถาม 2</Td>
												<Td>
													<RadioGroup defaultValue="2">
														<Stack spacing="16px" direction="row">
															<Radio value="1">จริง</Radio>
															<Radio value="2">เท็จ</Radio>
														</Stack>
													</RadioGroup>
												</Td>
											</Tr>
											<Tr bg="green.100">
												<Td>3</Td>
												<Td>คำถาม 3</Td>
												<Td>
													<RadioGroup defaultValue="2">
														<Stack spacing="16px" direction="row">
															<Radio value="1">จริง</Radio>
															<Radio value="2">เท็จ</Radio>
														</Stack>
													</RadioGroup>
												</Td>
											</Tr>
										</Tbody>
									</Table>
								</Box>
							</Collapse>
						</ModalBody>
						<ModalFooter>
							<Button onClick={() => (setModalContent(null), setTargetCollapse(null))}>ปิด</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
				<Box bg="white" p="4" rounded="md" boxShadow="md">
					<Table variant='simple'>
						<TableCaption>ทั้งหมด 0 ผู้ทำแบบทดสอบ</TableCaption>
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
							<Tr>
								<Td>1/1/2564</Td>
								<Td>62130500001</Td>
								<Td>นาย ภาณุพงศ์ พรหมสุข</Td>
								<Td>ITS</Td>
								<Td color="red">6</Td>
								<Td>
									<IconButton onClick={() => setModalContent(1)} colorScheme="blue" aria-label="ตรวจสอบ" icon={<BiSearch />} />
								</Td>
							</Tr>
						</Tbody>
					</Table>
				</Box>
			</Box>
		</Sidebar>
	);
}
export default TesterPage;
