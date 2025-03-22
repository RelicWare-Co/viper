import { useState, useEffect, useCallback } from "react";
import { 
  Box, 
  Title, 
  Text, 
  Button, 
  TextInput, 
  Card, 
  Group, 
  Stack, 
  SimpleGrid, 
  Container, 
  Loader, 
  Center,
  Image,
  Flex
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { authClient } from "../../lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconPlus, IconCheck, IconX } from "@tabler/icons-react";

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
}

function Orgs() {
  const [isCreating, setIsCreating] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const { data: organizations = [], isPending } = authClient.useListOrganizations();

  const form = useForm({
    initialValues: {
      name: "",
      slug: "",
      logo: "",
    },
    validate: {
      name: (value: string) => (value.length < 2 ? "Name must be at least 2 characters" : null),
      slug: (value: string) => {
        if (value.length < 2) return "Slug must be at least 2 characters";
        if (!/^[a-z0-9-]+$/.test(value)) return "Slug can only contain lowercase letters, numbers, and hyphens";
        if (isSlugAvailable === false) return "This slug is already taken";
        return null;
      },
      logo: (value: string) => (value && !value.startsWith("http") ? "Logo must be a valid URL" : null),
    },
  });

  const checkSlug = useCallback(async (slug: string) => {
    if (!slug || slug.length < 2 || !/^[a-z0-9-]+$/.test(slug)) {
      setIsSlugAvailable(null);
      return;
    }

    setIsCheckingSlug(true);
    try {
      await authClient.organization.checkSlug({ slug });
      setIsSlugAvailable(true);
    } catch (error) {
      setIsSlugAvailable(false);
    } finally {
      setIsCheckingSlug(false);
    }
  }, []);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (form.values.slug) {
        checkSlug(form.values.slug);
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [form.values.slug, checkSlug]);

  const handleCreateOrg = async (values: typeof form.values) => {
    try {
      await authClient.organization.create({
        name: values.name,
        slug: values.slug,
        logo: values.logo || undefined,
      });
      
      setIsCreating(false);
      form.reset();
      notifications.show({
        title: "Success",
        message: "Organization created successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to create organization",
        color: "red",
      });
    }
  };

  const setActiveOrg = async (orgId: string) => {
    try {
      await authClient.organization.setActive({
        organizationId: orgId,
      });
      
      notifications.show({
        title: "Success",
        message: "Active organization changed",
        color: "green",
      });
      
      // Redirect to dashboard or refresh the page
      window.location.href = "/dashboard";
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "Failed to change active organization",
        color: "red",
      });
    }
  };

  if (isPending) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Box mb="xl">
        <Flex justify="space-between" align="center" mb="md">
          <Title order={1}>Organizations</Title>
          {!isCreating && (
            <Button 
              leftSection={<IconPlus size={16} />} 
              onClick={() => setIsCreating(true)}
            >
              Create Organization
            </Button>
          )}
        </Flex>
        <Text c="dimmed">Select an organization or create a new one to get started.</Text>
      </Box>

      {isCreating ? (
        <Card shadow="sm" p="lg" radius="md" withBorder mb="xl">
          <Title order={3} mb="md">Create New Organization</Title>
          <form onSubmit={form.onSubmit(handleCreateOrg)}>
            <Stack>
              <TextInput
                label="Organization Name"
                placeholder="My Organization"
                required
                {...form.getInputProps("name")}
              />
              
              <TextInput
                label="Organization Slug"
                placeholder="my-org"
                required
                rightSection={
                  isCheckingSlug ? (
                    <Loader size="xs" />
                  ) : isSlugAvailable === true ? (
                    <IconCheck size={16} color="green" />
                  ) : isSlugAvailable === false ? (
                    <IconX size={16} color="red" />
                  ) : null
                }
                {...form.getInputProps("slug")}
              />
              
              <TextInput
                label="Logo URL (Optional)"
                placeholder="https://example.com/logo.png"
                {...form.getInputProps("logo")}
              />
              
              <Group justify="flex-end" mt="md">
                <Button variant="light" onClick={() => {
                  setIsCreating(false);
                  form.reset();
                }}>
                  Cancel
                </Button>
                <Button type="submit">Create Organization</Button>
              </Group>
            </Stack>
          </form>
        </Card>
      ) : null}

      {organizations && organizations.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
          {organizations.map((org) => (
            <Card 
              key={org.id} 
              shadow="sm" 
              padding="lg" 
              radius="md" 
              withBorder
              onClick={() => setActiveOrg(org.id)}
              style={{ cursor: "pointer" }}
            >
              <Card.Section p="md">
                {org.logo ? (
                  <Image
                    src={org.logo}
                    height={160}
                    alt={org.name}
                    fallbackSrc="https://placehold.co/400x200?text=No+Logo"
                  />
                ) : (
                  <Center h={160} bg="gray.1">
                    <Text fw={500} c="dimmed">{org.name.substring(0, 2).toUpperCase()}</Text>
                  </Center>
                )}
              </Card.Section>

              <Stack mt="md" mb="xs">
                <Text fw={500}>{org.name}</Text>
                <Text size="sm" c="dimmed">
                  {org.slug}
                </Text>
              </Stack>

              <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                Select Organization
              </Button>
            </Card>
          ))}
        </SimpleGrid>
      ) : !isCreating ? (
        <Card shadow="sm" p="xl" radius="md" withBorder>
          <Center>
            <Stack align="center">
              <Text fw={500} size="lg">No organizations found</Text>
              <Text c="dimmed" ta="center">You don't have any organizations yet. Create your first organization to get started.</Text>
              <Button 
                leftSection={<IconPlus size={16} />} 
                onClick={() => setIsCreating(true)}
                mt="md"
              >
                Create Organization
              </Button>
            </Stack>
          </Center>
        </Card>
      ) : null}
    </Container>
  );
}

export default Orgs;