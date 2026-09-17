import React, { useState } from 'react';

/**
 * Todo — Task management panel
 * Add, complete, and delete tasks.
 */
export default function Todo({ tasks, onAddTask, onToggleTask, onDeleteTask, onClose }) {
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const handleAdd = () => {
    const title = newTaskTitle.trim();
    if (!title) return;
    onAddTask(title);
    setNewTaskTitle('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <>
      <div className="nami-panel-overlay" onClick={onClose}></div>
      <div className="nami-panel" role="dialog" aria-label="Task list">
        <div className="nami-panel-header">
          <span className="nami-panel-title">
            Tasks
            {tasks.length > 0 && (
              <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 8, fontSize: '0.78rem' }}>
                {completedCount}/{tasks.length}
              </span>
            )}
          </span>
          <button className="nami-panel-close" onClick={onClose} aria-label="Close">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        <div className="nami-panel-body">
          <div className="nami-todo-input-row">
            <input
              id="todo-input"
              type="text"
              className="nami-todo-input"
              placeholder="Add a task..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={80}
            />
            <button
              className="nami-todo-add-btn"
              onClick={handleAdd}
              aria-label="Add task"
              disabled={!newTaskTitle.trim()}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>

          {tasks.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
              No tasks yet. Add one above.
            </p>
          ) : (
            <ul className="nami-todo-list">
              {tasks.map(task => (
                <li key={task.id} className="nami-todo-item">
                  <input
                    type="checkbox"
                    className="nami-todo-checkbox"
                    checked={task.completed}
                    onChange={() => onToggleTask(task.id)}
                    aria-label={`Mark "${task.title}" as ${task.completed ? 'incomplete' : 'complete'}`}
                  />
                  <span className={`nami-todo-text ${task.completed ? 'completed' : ''}`}>
                    {task.title}
                  </span>
                  <button
                    className="nami-todo-delete"
                    onClick={() => onDeleteTask(task.id)}
                    aria-label={`Delete "${task.title}"`}
                  >
                    <i className="bi bi-trash3"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
