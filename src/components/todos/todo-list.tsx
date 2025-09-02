import { TodoItem } from "./todo-item"

type Todo = {
  id: string
  content: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}

interface TodoListProps {
  todos: Todo[]
}

export function TodoList({ todos }: TodoListProps) {
  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  )
}