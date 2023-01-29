import {
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Card,
	Flex,
	ScaleFade
} from '@chakra-ui/react'
import { useState } from 'react'
import { BiArrowToRight } from 'react-icons/bi'

function IndexPage() {
	const [seudentName, setStudentName] = useState('')
	const [studentId, setStudentId] = useState('')
	const [studentBranch, setStudentBranch] = useState('')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
	}

	return (
		<ScaleFade initialScale={0.95} in={true}>
			<Flex justify="center" align="center" flexDir="column" h="100vh">
				<Card p={5} shadow="md" boxShadow="lg" borderColor="gray.5000">
					<form onSubmit={handleSubmit}>
						<Stack width={['sm']}>
							<FormControl>
								<FormLabel htmlFor="studentName">ชื่อนักศึกษา</FormLabel>
								<Input
									id="studentName"
									type="text"
									value={seudentName}
									mb={2}
									onChange={(e) => setStudentName(e.target.value)}
								/>
								<FormLabel htmlFor="studentId">รหัสนักศึกษา</FormLabel>
								<Input
									id="studentId"
									type="text"
									value={studentId}
									mb={2}
									onChange={(e) => setStudentId(e.target.value)}
								/>
								<FormLabel htmlFor="studentBranch">สาขาวิชา</FormLabel>
								<Input
									id="studentBranch"
									type="text"
									value={studentBranch}
									mb={6}
									onChange={(e) => setStudentBranch(e.target.value)}
								/>
							</FormControl>
							<Button
								colorScheme="teal"
								leftIcon={<BiArrowToRight />}
								type="submit"
							>
								เข้าทำข้อสอบ
							</Button>
						</Stack>
					</form>
				</Card>
			</Flex>
		</ScaleFade>
	)
}
export default IndexPage
