import { Box, Grid, GridItem, Text } from "@chakra-ui/react";
import { FiFileText, FiUser } from "react-icons/fi";
import DashCard from "../../components/dashCard";
import Sidebar from "../../layouts/default";
import { Chart as ChartJS, BarElement, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";
import { Bar, Line } from 'react-chartjs-2';


const LineChart = () => {
	const data = {
		labels: ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'],
		datasets: [
			{
				label: 'ผู้เข้ามาทำแบบทดสอบ',
				data: [12, 19, 3, 5, 2, 3, 1],
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

const BarChart = () => {
	const data = {
		labels: ['CSS', 'ITS', 'DMT'],
		datasets: [
			{
				label: 'จำนวนผู้ทำแบบทดสอบ',
				data: [12, 19, 3, 5, 2, 3, 1],
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(255, 206, 86, 0.2)',
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(255, 206, 86, 1)',
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
	ChartJS.register(ArcElement, BarElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);
	return (
		<Sidebar>
			<Box>
				<Text fontSize="6xl">
					หน้าหลัก
				</Text>
				<Grid templateColumns={{
					base: "repeat(1, 1fr)",
					md: "repeat(2, 1fr)",
					lg: "repeat(3, 1fr)",
					xl: "repeat(4, 1fr)"
				}} fontSize="lg" gap={6}>
					<GridItem>
						<DashCard color="#246dec" title="ผู้ทำแบบทดสอบ" value={195} icon={<FiUser />} />
					</GridItem>
					<GridItem>
						<DashCard color="#f5b74f" title="เข้าสอบ" value={30} icon={<FiFileText />} />
					</GridItem>
					<GridItem colSpan={2} />
					<GridItem colSpan={2}>
						<Box bg="white" p="4" rounded="md" borderColor="gray.500" boxShadow="md">
							<Text textAlign="center" mb="1" fontWeight="bold">
								จำนวนผู้ทำแบบทดสอบ
							</Text>
							<LineChart />
						</Box>
					</GridItem>
					<GridItem colSpan={2}>
						<Box bg="white" p="4" rounded="md" borderColor="gray.500" boxShadow="md">
							<Text textAlign="center" mb="1" fontWeight="bold">
								แบ่งผู้ทำแบบทดสอบตามสาขา
							</Text>
							<BarChart />
						</Box>
					</GridItem>
				</Grid>
			</Box>
		</Sidebar>
	);
}
export default AdminPage;
