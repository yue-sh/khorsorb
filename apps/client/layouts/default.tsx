import React, { ReactNode } from 'react';
import {
	IconButton,
	Box,
	CloseButton,
	Flex,
	Icon,
	useColorModeValue,
	Link,
	Drawer,
	DrawerContent,
	Text,
	useDisclosure,
	BoxProps,
	FlexProps,
	Image
} from '@chakra-ui/react';
import {
	FiHome,
	FiTrendingUp,
	FiCompass,
	FiArrowRight,
	FiMenu,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';

interface LinkItemProps {
	name: string;
	icon: IconType;
}
const LinkItems: Array<LinkItemProps> = [
	{ name: 'หน้าหลัก', icon: FiHome },
	{ name: 'ผู้ทำแบบทดสอบ', icon: FiTrendingUp },
	{ name: 'จัดการแบบทดสอบ', icon: FiCompass },
	{ name: 'ออกจากระบบ', icon: FiArrowRight },
];

export default function SimpleSidebar({ children }: { children: ReactNode }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
			<SidebarContent
				onClose={() => onClose}
				display={{ base: 'none', md: 'block' }}
			/>
			<Drawer
				autoFocus={false}
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				returnFocusOnClose={false}
				onOverlayClick={onClose}
				size="full">
				<DrawerContent>
					<SidebarContent onClose={onClose} />
				</DrawerContent>
			</Drawer>
			{/* mobilenav */}
			<MobileNav display={{ base: 'flex', md: 'none' }} onOpen={onOpen} />
			<Box ml={{ base: 0, md: 60 }} p="8">
				{children}
			</Box>
		</Box>
	);
}

interface SidebarProps extends BoxProps {
	onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
	return (
		<Box
			bg={useColorModeValue('#1a1c24', 'gray.900')}
			borderRight="1px"
			color="white"
			borderRightColor={useColorModeValue('gray.200', 'gray.700')}
			w={{ base: 'full', md: 60 }}
			pos="fixed"
			h="full"
			{...rest}>
			<Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
				<Image alt="nong bot noi" h="full" py="4" mr="2" src="https://m1r.ai/9/83gqw.png" />
				<Text fontSize="lg" fontFamily="monospace" fontWeight="bold">
					nong bot noi
				</Text>
				<CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
			</Flex>
			{LinkItems.map((link) => (
				<NavItem key={link.name} icon={link.icon}>
					{link.name}
				</NavItem>
			))}
		</Box>
	);
};

interface NavItemProps extends FlexProps {
	icon: IconType;
	children: ReactText;
}
const NavItem = ({ icon, children, ...rest }: NavItemProps) => {
	return (
		<Link href="#" style={{ textDecoration: 'none' }} _focus={{ boxShadow: 'none' }}>
			<Flex
				align="center"
				p="4"
				mx="4"
				borderRadius="lg"
				role="group"
				cursor="pointer"
				_hover={{
					bg: '#3850d3',
					color: 'white',
				}}
				{...rest}>
				{icon && (
					<Icon
						mr="4"
						fontSize="16"
						_groupHover={{
							color: 'white',
						}}
						as={icon}
					/>
				)}
				{children}
			</Flex>
		</Link>
	);
};

interface MobileProps extends FlexProps {
	onOpen: () => void;
}
const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
	return (
		<Flex
			ml={{ base: 0, md: 60 }}
			px={{ base: 4, md: 24 }}
			height="20"
			alignItems="center"
			bg={useColorModeValue('white', 'gray.900')}
			borderBottomWidth="1px"
			borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
			justifyContent="flex-start"
			{...rest}>
			<IconButton
				variant="outline"
				onClick={onOpen}
				aria-label="open menu"
				icon={<FiMenu />}
			/>

			<Image alt="nong bot noi" h="full" py="4" mr="2" ml="4" src="https://m1r.ai/9/83gqw.png" />
			<Text fontSize="lg" fontFamily="monospace" fontWeight="bold">
				nong bot noi
			</Text>
		</Flex>
	);
};
