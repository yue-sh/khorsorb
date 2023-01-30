import { FormControl, FormLabel, Input, Stack, Button, Card, Flex, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiArrowToRight } from "react-icons/bi";
import { ENDPOINT_URL } from "../../libs/utils";

function LoginPage() {
	const [password, setPassword] = useState("");
	const toast = useToast();
	const router = useRouter();
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Perform authentication here using the password
		// If authentication is successful, redirect to the admin page
		fetch(ENDPOINT_URL + "/v1/admin/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username: 'admin', password }),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.success) {
					//Set token as cookie
					document.cookie = `token=${data.token}; path=/`;
					router.push("/admin");
					return toast({
						title: "เข้าสู่ระบบแอดมินสำเร็จ",
						description: "ยินดีต้อนรับสู่ระบบแอดมิน",
						status: "success",
						duration: 5000,
						isClosable: true,
					});
				}
				toast({
					title: "เข้าสู่ระบบแอดมินไม่สำเร็จ",
					description: "รหัสผ่านไม่ถูกต้อง",
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			}
			);
	};

	useEffect(() => {
		// If the user is already logged in, redirect to the admin page
		if (document.cookie.includes("token")) {
			//Try fetch path /stats
			fetch(ENDPOINT_URL + "/v1/admin/stats", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${document.cookie.split("=")[1]}`,
				},
			})
				.then((res) => res.json())
				.then((data) => {
					if (data?.statusCode !== 401) {
						router.push("/admin");
					}
				});
		}
	}, []);

	return (
		<Flex align="center" h="100vh" justify="center">
			<Card p={5} shadow="md" boxShadow="lg" borderColor="gray.5000">
				<form onSubmit={handleSubmit}>
					<Stack>
						<FormControl>
							<FormLabel htmlFor="password">โปรดกรอกรหัสผ่าน</FormLabel>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</FormControl>
						<Button colorScheme="teal" leftIcon={<BiArrowToRight />} type="submit">
							เข้าสู่ระบบแอดมิน
						</Button>
					</Stack>
				</form>
			</Card>
		</Flex>
	);
}
export default LoginPage;
