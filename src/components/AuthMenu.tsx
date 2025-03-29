import { authClient } from "@/lib/auth-client";
import { Avatar, Group, Menu, UnstyledButton, Text } from "@mantine/core";

function AuthMenu() {
    const { data } = authClient.useSession();
    return (
        <Menu shadow="md" offset={0} transitionProps={{ transition: 'rotate-right', duration: 150 }}>
            <Menu.Target>
            <UnstyledButton
      style={{
        color: 'var(--mantine-color-text)',
        borderRadius: 'var(--mantine-radius-sm)',
      }}
    >
      <Group>
        <Avatar radius="xl">
            {data?.user.name.slice(0,1)}
        </Avatar>

        <div style={{ flex: 1 }}>
          <Text size="sm" fw={500}>
            {data?.user.name}
          </Text>

          <Text c="dimmed" size="xs">
            {data?.user.email}
          </Text>
        </div>

      </Group>
    </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
            <Menu.Label>Session</Menu.Label>
            <Menu.Item>
                Signout
            </Menu.Item>
            </Menu.Dropdown>

        </Menu>
    )
}

export default AuthMenu;