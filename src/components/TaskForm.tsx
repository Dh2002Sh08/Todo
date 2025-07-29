import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (title: string, description: string) => Promise<void>;
}

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    await onAddTask(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setLoading(false);
    setIsExpanded(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
      <form onSubmit={handleSubmit} className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plus className="w-4 h-4 text-blue-600" />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            className="flex-1 text-lg font-medium border-none outline-none placeholder-gray-400"
            placeholder="Add a new task..."
            required
          />
        </div>
        
        {isExpanded && (
          <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Add a description (optional)"
              rows={2}
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setTitle('');
                  setDescription('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !title.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}