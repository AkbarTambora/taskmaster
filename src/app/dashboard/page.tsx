import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { TodoList } from "@/components/todos/todo-list"
import { AddTodoForm } from "@/components/todos/add-todo-form"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"

async function LogoutButton() {
  async function handleSignOut() {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  return (
    <form action={handleSignOut}>
      <Button variant="outline" type="submit">
        Sign Out
      </Button>
    </form>
  )
}

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Fetch user's todos from database
  const todos = await prisma.todo.findMany({
    where: {
      userId: session.user.id
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your tasks and stay productive
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Add Todo Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Add New Task
          </h2>
          <AddTodoForm />
        </div>

        {/* Todo List Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Tasks ({todos.length})
            </h2>
            {todos.length > 0 && (
              <div className="text-sm text-gray-500">
                {todos.filter(todo => todo.completed).length} completed
              </div>
            )}
          </div>

          {todos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No tasks yet</div>
              <div className="text-gray-500 text-sm">
                Add your first task above to get started!
              </div>
            </div>
          ) : (
            <TodoList todos={todos} />
          )}
        </div>
      </div>
    </div>
  )
}