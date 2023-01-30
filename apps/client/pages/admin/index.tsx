import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { FiFileText, FiUser } from "react-icons/fi";
import Sidebar from "../../layouts/default";
import { Chart as ChartJS, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Bar, Line } from 'react-chartjs-2';
import { useEffect, useState } from "react";
import { ENDPOINT_URL } from "../../libs/utils";
import { useRouter } from "next/router";
import DashCard from "../../components/DashCard";


const LineChart = ({ datas }: { datas: number[] }) => {
	const data = {
		labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
		datasets: [
			{
				label: 'ผู้เข้ามาทำแบบทดสอบ',
				data: datas,
				fill: true,
				backgroundColor: '#dad4eb',
				borderColor: '#5137a2',
			}
		],
	};

	const options = {
		plugins: {
			legend: {
				display: false
			}
		},
		title: {
			display: true,
			text: 'จำนวนผู้ทำแบบทดสอบ'
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}

	return (<Line data={data} options={options} />);
};

const BarChart = ({ datas }: { datas: any }) => {
	const mappedData = []
	for (const key in datas) {
		mappedData.push({ name: key, value: datas[key] })
	}
	mappedData.sort((a: any, b: any) => b.value - a.value);

	const data = {
		labels: mappedData.map((data: any) => data.name),
		datasets: [
			{
				label: 'จำนวนผู้ทำแบบทดสอบ',
				data: mappedData.map((data: any) => data.value),
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)',
				],
				borderWidth: 1,
			},
		],
	};

	const options = {
		plugins: {
			legend: {
				display: false
			}
		},
		title: {
			display: true,
			text: 'จำนวนผู้ทำแบบทดสอบ'
		},
		scales: {
			y: {
				beginAtZero: true
			}
		}
	}

	return (<Bar data={data} options={options} />);
};

function AdminPage() {
	const router = useRouter();
	const [statsData, setStatsData] = useState(null as any)
	useEffect(() => {
		try {
			if (document.cookie.includes("token")) {
				fetch(ENDPOINT_URL + "/v1/admin/stats", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${document.cookie.split("=")[1]}`,
					},
				})
					.then((res) => res.json())
					.then((data) => {
						if (data?.statusCode === 401) {
							router.push("/admin/signin");
						}
						setStatsData(data);
					});
			}
			return
		} catch (e) {
			console.log(e)
		}
		router.push("/admin/signin");
	}, [router.isReady]);

	ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					หน้าหลัก
				</Text>
				{
					statsData && (
						<Grid templateColumns={{
							base: "repeat(1, 1fr)",
							md: "repeat(2, 1fr)",
							lg: "repeat(3, 1fr)",
							xl: "repeat(4, 1fr)"
						}} fontSize="lg" gap={6}>
							<GridItem>
								<DashCard color="#246dec" title="ผู้ทำแบบทดสอบ" value={statsData?.examSubmitCount} icon={<FiUser />} />
							</GridItem>
							<GridItem>
								<DashCard color="#f5b74f" title="แบบทดสอบ" value={statsData.examCount} icon={<FiFileText />} />
							</GridItem>
							<GridItem colSpan={2} />
							<GridItem colSpan={2}>
								<Box bg="white" p="4" rounded="md" borderColor="gray.500" boxShadow="md">
									<Text textAlign="center" mb="1" fontWeight="bold">
										จำนวนผู้ทำแบบทดสอบ
									</Text>
									<LineChart datas={statsData?.weeklyExamSubmitCount} />
								</Box>
							</GridItem>
							<GridItem colSpan={2}>
								<Box bg="white" p="4" rounded="md" borderColor="gray.500" boxShadow="md">
									<Text textAlign="center" mb="1" fontWeight="bold">
										แบ่งผู้ทำแบบทดสอบตามสาขา
									</Text>
									<BarChart datas={statsData?.examSubmitByBranch} />
								</Box>
							</GridItem>
						</Grid>
					)
				}
			</Box>
		</Sidebar>
	);
}
export default AdminPage;
