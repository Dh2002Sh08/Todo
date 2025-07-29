import React from 'react';
import { CheckCircle, Circle, List } from 'lucide-react';

export type FilterType = 'all' | 'pending' | 'completed';

interface TaskFilterProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  taskCounts: {
    all: number;
    pending: number;
    completed: number;
  };
}

export function TaskFilter({ activeFilter, onFilterChange, taskCounts }: TaskFilterProps) {
  const filters = [
    { key: 'all' as const, label: 'All Tasks', icon: List, count: taskCounts.all },
    { key: 'pending' as const, label: 'Pending', icon: Circle, count: taskCounts.pending },
    { key: 'completed' as const, label: 'Completed', icon: CheckCircle, count: taskCounts.completed },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon;
        const isActive = activeFilter === filter.key;
        
        return (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{filter.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              isActive
                ? 'bg-blue-500 text-blue-100'
                : 'bg-gray-100 text-gray-500'
            }`}>
              {filter.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}