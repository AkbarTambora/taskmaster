"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addTodo } from "@/lib/actions/todo.actions"
import { Plus } from "lucide-react"

export function AddTodoForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  async function onSubmit(formData: FormData) {
    setIsLoading(true)
    setError("")
    
    const result = await addTodo(formData)
    
    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      // Clear form on success
      const form = document.getElementById("add-todo-form") as HTMLFormElement
      form?.reset()
      setIsLoading(false)
    }
  }

  return (
    <form id="add-todo-form" action={onSubmit} className="flex gap-2">
      <Input
        name="content"
        placeholder="What needs to be done?"
        disabled={isLoading}
        className="flex-1"
        maxLength={500}
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          "Adding..."
        ) : (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </>
        )}
      </Button>
      {error && (
        <div className="text-red-600 text-sm mt-2">{error}</div>
      )}
    </form>
  )
}