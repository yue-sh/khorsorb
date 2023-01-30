import {
	FormControl,
	FormLabel,
	Input,
	Stack,
	Button,
	Card,
	Flex,
	ScaleFade,
	Select
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { BiArrowToRight } from 'react-icons/bi'

function IndexPage() {
	const router = useRouter()
	const [studentName, setStudentName] = useState('')
	const [studentId, setStudentId] = useState('')
	const [studentBranch, setStudentBranch] = useState('DMT')

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		console.log(studentName, studentId, studentBranch)
		if (studentName == '' || studentId == '' || studentBranch == '') return
		const encodedData = JSON.stringify({
			studentName,
			studentId,
			studentBranch
		})
		router.push(`/exam?data=${btoa(encodedData)}`)
	}

	return (
		<ScaleFade initialScale={0.95} in={true}>
			<Flex justify="center" align="center" flexDir="column" h="100vh">
				<Card p={5} shadow="md" boxShadow="lg" border="1px" borderColor="gray.200">
					<form onSubmit={handleSubmit}>
						<Stack width={['sm']}>
							<FormControl>
								<FormLabel htmlFor="studentName">ชื่อนักศึกษา</FormLabel>
								<Input
									id="studentName"
									type="text"
									value={studentName}
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
								<Select
									mb={6}
									value={studentBranch}
									onChange={(e) => setStudentBranch(e.target.value)}
								>
									<option value="DMT">DMT</option>
									<option value="ITS">ITS</option>
									<option value="CSS">CSS</option>
								</Select>
							</FormControl>
							<Button
								colorScheme="teal"
								leftIcon={<BiArrowToRight />}
								type="submit"
							>
								เข้าทำแบบทดสอบ
							</Button>
						</Stack>
					</form>
				</Card>
			</Flex>
		</ScaleFade>
	)
}
export default IndexPage
