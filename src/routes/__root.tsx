import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import {
	MantineProvider,
	AppShell,
	Group,
	Burger,
	Button,
	Text,
	Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet, createRootRoute, useRouter } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Notifications } from "@mantine/notifications";
import { Link } from "@/components/Link";
import theme from "@/lib/theme";
import { authClient } from "@/lib/auth-client";
export const Route = createRootRoute({
	component: Root,
});

function Root() {
	const router = useRouter();
	const { data: session } = authClient.useSession();
	const [opened, { toggle }] = useDisclosure();
	return (
		<>
			<TanStackRouterDevtools />
			<MantineProvider theme={theme}>
				<Notifications />
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
								<Image h={50} fit="contain" src={"/logo.svg"} />{" "}
							</a>
							<Group h="100%" px="md" flex={1} justify="right">
								{session ? (
									<Button onClick={() => authClient.signOut()}>Sign out</Button>
								) : (
									<Button onClick={() => router.navigate({ to: "/auth" })}>
										Sign in
									</Button>
								)}
							</Group>
							<Text>{session?.user?.name}</Text>
						</Group>
					</AppShell.Header>
					<AppShell.Navbar p="md">
						<Link href="/" label="Welcome" />
						<Link href="/dashboard" label="Dashboard" />
						<Link href="/todo" label="Todo" />
						<Link href="/star-wars" label="Data Fetching" />
						<Link href="/orgs" label="Organizations" />
						<Link href="/categories" label="Categories" />
					</AppShell.Navbar>
					<AppShell.Main>
						{" "}
						<Outlet />
					</AppShell.Main>
				</AppShell>
			</MantineProvider>
		</>
	);
}
