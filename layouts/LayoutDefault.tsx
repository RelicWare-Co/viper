import "@mantine/core/styles.css";
import type React from "react";
import {
	AppShell,
	Burger,
	Button,
	Group,
	Image,
	MantineProvider,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import theme from "./theme.js";

import logoUrl from "../assets/logo.svg";
import { Link } from "../components/Link";
import { authClient } from "../lib/auth-client.js";
import { navigate } from "vike/client/router";

export default function LayoutDefault({
	children,
}: { children: React.ReactNode }) {
	const { data: session } = authClient.useSession();
	const [opened, { toggle }] = useDisclosure();
	return (
		<MantineProvider theme={theme}>
			<AppShell
				header={{ height: 60 }}
				navbar={{
					width: 300,
					breakpoint: "sm",
					collapsed: { mobile: !opened },
				}}
				padding="md"
			>
				<AppShell.Header>
					<Group h="100%" px="md" justify="space-between">
						<Burger
							opened={opened}
							onClick={toggle}
							hiddenFrom="sm"
							size="sm"
						/>
						<a href="/">
							{" "}
							<Image h={50} fit="contain" src={logoUrl} />{" "}
						</a>
						<Group h="100%" px="md" flex={1} justify="right">
							{session ? (
								<Button onClick={() => authClient.signOut()}>Sign out</Button>
							) : (
								<Button onClick={() => navigate("/auth")}>Sign in</Button>
							)}
						</Group>
						<Text>{session?.user?.name}</Text>
					</Group>
				</AppShell.Header>
				<AppShell.Navbar p="md">
					<Link href="/" label="Welcome" />
					<Link href="/todo" label="Todo" />
					<Link href="/star-wars" label="Data Fetching" />
				</AppShell.Navbar>
				<AppShell.Main> {children} </AppShell.Main>
			</AppShell>
		</MantineProvider>
	);
}
