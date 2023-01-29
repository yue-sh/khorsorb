import { FormControl, FormLabel, Input, Stack, Button, Card, Flex } from "@chakra-ui/react";
import { useState } from "react";
import { BiArrowToRight } from "react-icons/bi";

function LoginPage() {
	const [password, setPassword] = useState("");

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// Perform authentication here using the password
	};

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
