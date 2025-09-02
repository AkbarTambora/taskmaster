"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toggleTodo, deleteTodo, updateTodo } from "@/lib/actions/todo.actions"
import { Check, X, Edit, Trash2, Save } from "lucide-react"

type Todo = {
  id: string
  content: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TodoItemProps {
  todo: Todo
}

export function TodoItem({ todo }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(todo.content)
  const [isLoading, setIsLoading] = useState(false)

  async function handleToggle() {
    setIsLoading(true)
    const formData = new FormData()
    formData.append("id", todo.id)
    formData.append("completed", (!todo.completed).toString())
    
    await toggleTodo(formData)
    setIsLoading(false)
  }

  async function handleDelete() {
    if (confirm("Are you sure you want to delete this task?")) {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("id", todo.id)
      
      await deleteTodo(formData)
      setIsLoading(false)
    }
  }

  async function handleUpdate() {
    if (editContent.trim() === "") return
    
    setIsLoading(true)
    const formData = new FormData()
    formData.append("id", todo.id)
    formData.append("content", editContent)
    
    const result = await updateTodo(formData)
    if (result?.success) {
      setIsEditing(false)
    }
    setIsLoading(false)
  }

  function handleCancelEdit() {
    setEditContent(todo.content)
    setIsEditing(false)
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${
      todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200'
    }`}>
      {/* Checkbox */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading}
        className={`w-6 h-6 rounded-full border-2 ${
          todo.completed 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-500'
        }`}
      >
        {todo.completed && <Check className="w-4 h-4" />}
      </Button>

      {/* Content */}
      <div className="flex-1">
        {isEditing ? (
          <Input
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            maxLength={500}
            disabled={isLoading}
          />
        ) : (
          <span className={`${
            todo.completed 
              ? 'line-through text-gray-500' 
              : 'text-gray-900'
          }`}>
            {todo.content}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-1">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleUpdate}
              disabled={isLoading || editContent.trim() === ""}
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCancelEdit}
              disabled={isLoading}
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={isLoading}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}