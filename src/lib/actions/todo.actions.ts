"use server"

import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const AddTodoSchema = z.object({
  content: z.string().min(1, "Todo content is required").max(500, "Todo is too long"),
})

const UpdateTodoSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Todo content is required").max(500, "Todo is too long"),
})

const ToggleTodoSchema = z.object({
  id: z.string(),
  completed: z.boolean(),
})

export async function addTodo(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = AddTodoSchema.safeParse({
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid todo content",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await prisma.todo.create({
      data: {
        content: validatedFields.data.content,
        userId: session.user.id,
      }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Add todo error:", error)
    return { error: "Failed to add todo" }
  }
}

export async function toggleTodo(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = ToggleTodoSchema.safeParse({
    id: formData.get("id"),
    completed: formData.get("completed") === "true",
  })

  if (!validatedFields.success) {
    return { error: "Invalid todo data" }
  }

  try {
    // Verify todo belongs to user
    const todo = await prisma.todo.findUnique({
      where: { id: validatedFields.data.id }
    })

    if (!todo || todo.userId !== session.user.id) {
      return { error: "Todo not found" }
    }

    await prisma.todo.update({
      where: { id: validatedFields.data.id },
      data: { completed: validatedFields.data.completed }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Toggle todo error:", error)
    return { error: "Failed to update todo" }
  }
}

export async function deleteTodo(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const todoId = formData.get("id") as string

  if (!todoId) {
    return { error: "Todo ID is required" }
  }

  try {
    // Verify todo belongs to user
    const todo = await prisma.todo.findUnique({
      where: { id: todoId }
    })

    if (!todo || todo.userId !== session.user.id) {
      return { error: "Todo not found" }
    }

    await prisma.todo.delete({
      where: { id: todoId }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Delete todo error:", error)
    return { error: "Failed to delete todo" }
  }
}

export async function updateTodo(formData: FormData) {
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const validatedFields = UpdateTodoSchema.safeParse({
    id: formData.get("id"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid todo data",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Verify todo belongs to user
    const todo = await prisma.todo.findUnique({
      where: { id: validatedFields.data.id }
    })

    if (!todo || todo.userId !== session.user.id) {
      return { error: "Todo not found" }
    }

    await prisma.todo.update({
      where: { id: validatedFields.data.id },
      data: { content: validatedFields.data.content }
    })

    revalidatePath("/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Update todo error:", error)
    return { error: "Failed to update todo" }
  }
}