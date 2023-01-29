import { Modal, Editable, EditablePreview, EditableInput, ModalOverlay, Button, StatHelpText, Stat, StatLabel, StatNumber, ModalHeader, ModalCloseButton, ModalFooter, ModalContent, ModalBody, Box, Text, Table, Tr, Th, Thead, TableCaption, Tbody, Td, IconButton, Collapse, Grid, GridItem, RadioGroup, Stack, Radio } from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue, BiSearch, BiTrash } from "react-icons/bi";
import Sidebar from "../../layouts/default";
function ManagePage() {
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					จัดการแบบทดสอบ
				</Text>
				<Box mb="4" w="full" textAlign="right">
					<Button colorScheme="green" leftIcon={<BiAddToQueue />}>
						เพิ่มแบบทดสอบ
					</Button>
				</Box>
				<Box bg="white" p="8" rounded="md" boxShadow="md">
					<Editable defaultValue='1. คำถามที่ 1 หฟกฟกหฟกฟหกฟก'>
						<EditablePreview />
						<EditableInput />
					</Editable>
					<Box mt="4">
						<RadioGroup defaultValue="1">
							<Stack direction="row" spacing="64px">
								<Stack direction="row">
									<Radio value="1" />
									<Editable defaultValue='คำตอบที่ 1'>
										<EditablePreview />
										<EditableInput />
									</Editable>
								</Stack>
								<Stack direction="row">
									<Radio value="2" />
									<Editable defaultValue='คำตอบที่ 2'>
										<EditablePreview />
										<EditableInput />
									</Editable>
								</Stack>
							</Stack>
						</RadioGroup>
					</Box>
					<Box textAlign="right">
						<Button colorScheme="red" leftIcon={<BiTrash />}>
							ลบ
						</Button>
					</Box>
				</Box>
			</Box>
		</Sidebar>
	);
}
export default ManagePage;
