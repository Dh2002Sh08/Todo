import React, { useState, useMemo } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { TaskForm } from './TaskForm';
import { TaskCard } from './TaskCard';
import { TaskFilter, FilterType } from './TaskFilter';

export function Dashboard() {
  const { user, signOut } = useAuth();
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filteredTasks = useMemo(() => {
    switch (activeFilter) {
      case 'pending':
        return tasks.filter(task => !task.completed);
      case 'completed':
        return tasks.filter(task => task.completed);
      default:
        return tasks;
    }
  }, [tasks, activeFilter]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    pending: tasks.filter(task => !task.completed).length,
    completed: tasks.filter(task => task.completed).length,
  }), [tasks]);

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAddTask = async (title: string, description: string) => {
    await createTask(title, description);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TaskFlow</h1>
              <p className="text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Task Form */}
          <section>
            <TaskForm onAddTask={handleAddTask} />
          </section>

          {/* Task Filters and Stats */}
          <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TaskFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              taskCounts={taskCounts}
            />
          </section>

          {/* Task List */}
          <section>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {activeFilter === 'all' ? 'No tasks yet' :
                   activeFilter === 'pending' ? 'No pending tasks' :
                   'No completed tasks'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeFilter === 'all' ? 'Create your first task to get started!' :
                   activeFilter === 'pending' ? 'All your tasks are completed!' :
                   'Complete some tasks to see them here.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={toggleTaskComplete}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}