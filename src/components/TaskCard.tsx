import React, { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';
import { Task } from '../lib/supabase';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function TaskCard({ task, onToggleComplete, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!editTitle.trim()) return;
    
    setLoading(true);
    await onUpdate(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
    });
    setLoading(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  const handleToggleComplete = async () => {
    setLoading(true);
    await onToggleComplete(task.id, !task.completed);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      await onDelete(task.id);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md ${
      task.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:border-blue-200'
    }`}>
      <div className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Task title"
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Task description (optional)"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                disabled={loading || !editTitle.trim()}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm transition-colors"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-2">
              <h3 className={`text-lg font-medium ${
                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
              <div className="flex gap-1 ml-2">
                <button
                  onClick={handleToggleComplete}
                  disabled={loading}
                  className={`p-1.5 rounded-md transition-colors ${
                    task.completed
                      ? 'bg-green-100 text-green-600 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600'
                  }`}
                  title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-md bg-gray-100 text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"
                  title="Edit task"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="p-1.5 rounded-md bg-gray-100 text-gray-400 hover:bg-red-100 hover:text-red-600 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {task.description && (
              <p className={`text-sm ${
                task.completed ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {task.description}
              </p>
            )}
            <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
              <span>Created {new Date(task.created_at).toLocaleDateString()}</span>
              {task.completed && (
                <span className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs font-medium">
                  Completed
                </span>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}