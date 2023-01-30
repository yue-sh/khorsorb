import {
	Flex,
	ScaleFade,
	Box,
	Container,
	Text,
	Grid,
	GridItem,
	Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiRepeat } from 'react-icons/fi'

function IndexPage() {
	const router = useRouter()
	const [resultData, setResultData] = useState({} as any)

	useEffect(() => {
		if (!router.isReady) return
		const data = router.query.data
		if (data) {
			try {
				const decodedData = JSON.parse(atob(data as string))
				setResultData(decodedData)
				console.log(decodedData)
				return
			} catch (e) {
				console.log(e)
			}
		}
		router.push('/')
	}, [router.isReady])
	return (
		<ScaleFade initialScale={0.95} in={true}>
			<Container maxW="6xl" mt="16">
				<Box>
					<Text fontSize="4xl" fontWeight="bold">ผลแบบทดสอบ</Text>
				</Box>
				<Box boxShadow="md" p="6" mb="4" border="1px" borderColor="gray.300" rounded="md" minWidth="400px">
					<Grid templateColumns={{
						base: "repeat(1, 1fr)",
						md: "repeat(2, 1fr)"
					}} gap={6}>
						<GridItem>
							<Text fontSize="2xl" fontWeight="bold">ข้อมูลผู้เข้าทดสอบ</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">ชื่อนักศึกษา: {resultData?.tester?.studentName}</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">รหัสนักศึกษา: {resultData?.tester?.studentId}</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">สาขาวิชา: {resultData?.tester?.studentBranch}</Text>
						</GridItem>
						<GridItem>
							<Text fontSize="2xl" fontWeight="bold">ข้อมูลโดยคะแนนรวม</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">ทั้งหมด: {
								resultData?.list?.reduce((acc: any, item: any) => {
									return acc + item.questionsCount
								}, 0)
							} ข้อ</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">คะแนนที่ได้: {
								resultData?.list?.reduce((acc: any, item: any) => {
									return acc + item.point
								}, 0)
							} คะแนน</Text>
							<Text fontSize="lg" fontWeight="bold" mt="4">คิดเป็น: {
								Math.round((resultData?.list?.reduce((acc: any, item: any) => {
									return acc + item.point
								}
									, 0) / resultData?.list?.reduce((acc: any, item: any) => {
										return acc + item.questionsCount
									}, 0)) * 100)
							}%</Text>
						</GridItem>
					</Grid>
				</Box>
				<Flex justifyContent="center" textAlign="center" py="5">
					<Button colorScheme="green" size="lg" leftIcon={<FiRepeat />} onClick={() => router.push(`
					/exam?data=${btoa(JSON.stringify(resultData?.tester))}
					`)}>ทำแบบทดสอบใหม่อีกครั้ง</Button>
				</Flex>
				{
					resultData && resultData.list && resultData.list.map((item: any, index: number) => {
						return (
							<Flex key={index} justifyContent="center" textAlign="center">
								<Box boxShadow="md" p="6" mb="4" border="1px" borderColor="gray.300" rounded="md" minWidth="400px">
									<Text fontSize="2xl" fontWeight="bold">คะแนน {item.examName}</Text>
									<Text fontSize="lg" fontWeight="bold" mt="4">ทั้งหมด: {item.questionsCount} ข้อ</Text>
									<Text fontSize="lg" fontWeight="bold" mt="4">คะแนนที่ได้: {item.point} คะแนน</Text>
									<Text fontSize="lg" fontWeight="bold" mt="4">คิดเป็น: {
										Math.round((item.point / item.questionsCount) * 100)
									}%</Text>
								</Box>
							</Flex>
						)
					})
				}
			</Container>
		</ScaleFade>
	)
}
export default IndexPage
