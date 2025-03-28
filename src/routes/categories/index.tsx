import { Button, Modal, TextInput } from "@mantine/core";
import {
  onCheckCategoryExists,
  onCreateCategory,
  onGetCategories,
} from "./categories.telefunc";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/categories/')({
  component: Categories,
})


function Categories() {
  const [createModalOpened, { open, close }] = useDisclosure(false);

  const createCategoryForm = useForm({
    initialValues: {
      categoryName: "",
      categoryDescription: "",
    },
    validate: {
      categoryName: (value: string) =>
        value.trim().length === 0 ? "Category name is required" : null,
      categoryDescription: (value: string) =>
        value.trim().length === 0 ? "Category description is required" : null,
    },
  });

  const handleCreateCategory = async (values: {
    categoryName: string;
    categoryDescription: string;
  }) => {
    try {
      const categoryExists = await onCheckCategoryExists(values.categoryName);

      if (categoryExists) {
        notifications.show({
          title: "Categoría duplicada",
          message: `La categoría "${values.categoryName}" ya existe`,
          color: "yellow",
          autoClose: 5000,
        });
        return;
      }

      const category = await onCreateCategory(
        values.categoryName,
        values.categoryDescription
      );
      console.log(category);

      notifications.show({
        title: "Categoría creada",
        message: `La categoría "${values.categoryName}" ha sido creada exitosamente`,
        color: "green",
        autoClose: 5000,
      });
    } catch (error) {
      console.log("Failed to create category:", error);

      notifications.show({
        title: "Error",
        message: "No se pudo crear la categoría. Por favor intente nuevamente",
        color: "red",
        autoClose: 5000,
      });
    }
    createCategoryForm.reset();
    close();
  };

  return (
    <>
      <div>
        <h1>Categories</h1>
        <Button onClick={open}>Create new category</Button>
        <Button
          onClick={() =>
            onGetCategories().then((categories) => console.log(categories))
          }
        >
          Get Categories
        </Button>
      </div>
      <Modal
        opened={createModalOpened}
        onClose={close}
        title="Create new category"
      >
        <form onSubmit={createCategoryForm.onSubmit(handleCreateCategory)}>
          <TextInput
            label="Category name"
            placeholder="Category name"
            {...createCategoryForm.getInputProps("categoryName")}
          />

          <TextInput
            label="Category description"
            placeholder="Category description"
            {...createCategoryForm.getInputProps("categoryDescription")}
          />
          <Button type="submit">Create</Button>
        </form>
      </Modal>
    </>
  );
}
