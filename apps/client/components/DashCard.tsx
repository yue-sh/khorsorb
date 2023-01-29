import { Box, Flex, Text } from "@chakra-ui/react";

interface DashCardProps {
	title: string;
	icon: any;
	color: string;
	value: number;
}
function DashCard({ title, icon, color, value }: DashCardProps) {
	return (
		<Box position="relative">
			<Box position="absolute" zIndex="99" h="full" w="6px" left="0" roundedLeft="md" bg={color} />
			<Box boxShadow="md" border="1px" p="8" rounded="md" bg="white" color="gray.600" borderColor="gray.300">
				<Flex justifyContent="space-between">
					<Text bg="white">
						{title}
					</Text>
					<Box color={color} fontWeight="bold" fontSize="2xl">
						{icon}
					</Box>
				</Flex>
				<Box fontSize="3xl" fontWeight="bold" mt="2">{value}</Box>
			</Box>
		</Box>
	);
}
export default DashCard;
