import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const DEFAULT_GOALS = [
  { id: 1, title: 'Alcançar 1000 de rating', desc: 'Chegue a 1000 pontos no modo Rápido', icon: '🎯', target: 1000, current: 800, type: 'rating', unit: 'pts' },
  { id: 2, title: 'Jogar 50 partidas', desc: 'Complete 50 partidas online', icon: '♟', target: 50, current: 12, type: 'games', unit: 'partidas' },
  { id: 3, title: 'Resolver 100 puzzles', desc: 'Resolva 100 puzzles táticos', icon: '🧩', target: 100, current: 34, type: 'puzzles', unit: 'puzzles' },
  { id: 4, title: 'Sequência de 7 dias', desc: 'Jogue por 7 dias consecutivos', icon: '🔥', target: 7, current: 3, type: 'streak', unit: 'dias' },
  { id: 5, title: 'Vencer 10 partidas seguidas', desc: 'Conquiste uma sequência de 10 vitórias', icon: '⚡', target: 10, current: 2, type: 'winstreak', unit: 'vitórias' },
];

export default function Goals() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [goals, setGoals] = useState(DEFAULT_GOALS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', target: '', current: 0, icon: '🎯', unit: '' });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    const goal = {
      id: Date.now(),
      title: newGoal.title,
      desc: '',
      icon: newGoal.icon,
      target: parseInt(newGoal.target),
      current: parseInt(newGoal.current) || 0,
      type: 'custom',
      unit: newGoal.unit || 'pontos',
    };
    setGoals(prev => [...prev, goal]);
    setNewGoal({ title: '', target: '', current: 0, icon: '🎯', unit: '' });
    setShowAddModal(false);
  };

  const handleUpdateProgress = (id, delta) => {
    setGoals(prev => prev.map(g =>
      g.id === id ? { ...g, current: Math.min(Math.max(0, g.current + delta), g.target) } : g
    ));
  };

  const handleRemoveGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const completedGoals = goals.filter(g => g.current >= g.target);
  const activeGoals = goals.filter(g => g.current < g.target);

  return (
    <div className="goals-page">
      <div className="goals-header">
        <button className="goals-back-btn" onClick={() => navigate(-1)}>← Voltar</button>
        <div className="goals-title-row">
          <h1>🎯 Metas</h1>
          <button className="goals-add-btn" onClick={() => setShowAddModal(true)}>+ Nova Meta</button>
        </div>
        <p className="goals-subtitle">Defina e acompanhe seus objetivos no xadrez</p>
      </div>

      {/* Progress Summary */}
      <div className="goals-summary">
        <div className="goals-summary-item">
          <span className="goals-summary-value">{completedGoals.length}</span>
          <span className="goals-summary-label">Concluídas</span>
        </div>
        <div className="goals-summary-divider" />
        <div className="goals-summary-item">
          <span className="goals-summary-value">{activeGoals.length}</span>
          <span className="goals-summary-label">Em andamento</span>
        </div>
        <div className="goals-summary-divider" />
        <div className="goals-summary-item">
          <span className="goals-summary-value">
            {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
          </span>
          <span className="goals-summary-label">Progresso</span>
        </div>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 && (
        <div className="goals-section">
          <h2 className="goals-section-title">Em Andamento</h2>
          {activeGoals.map(goal => {
            const pct = Math.round((goal.current / goal.target) * 100);
            return (
              <div key={goal.id} className="goal-card">
                <div className="goal-card-header">
                  <span className="goal-icon">{goal.icon}</span>
                  <div className="goal-info">
                    <h3 className="goal-title">{goal.title}</h3>
                    {goal.desc && <p className="goal-desc">{goal.desc}</p>}
                  </div>
                  <button className="goal-remove-btn" onClick={() => handleRemoveGoal(goal.id)}>✕</button>
                </div>
                <div className="goal-progress-row">
                  <span className="goal-progress-text">{goal.current} / {goal.target} {goal.unit}</span>
                  <span className="goal-pct">{pct}%</span>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: `${pct}%` }} />
                </div>
                {goal.type === 'custom' && (
                  <div className="goal-controls">
                    <button className="goal-ctrl-btn" onClick={() => handleUpdateProgress(goal.id, -1)}>−</button>
                    <button className="goal-ctrl-btn primary" onClick={() => handleUpdateProgress(goal.id, 1)}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="goals-section">
          <h2 className="goals-section-title">✅ Concluídas</h2>
          {completedGoals.map(goal => (
            <div key={goal.id} className="goal-card completed">
              <div className="goal-card-header">
                <span className="goal-icon">{goal.icon}</span>
                <div className="goal-info">
                  <h3 className="goal-title">{goal.title}</h3>
                  <p className="goal-completed-label">Meta concluída! 🎉</p>
                </div>
                <button className="goal-remove-btn" onClick={() => handleRemoveGoal(goal.id)}>✕</button>
              </div>
              <div className="goal-progress-bar">
                <div className="goal-progress-fill completed" style={{ width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="goals-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="goals-modal" onClick={e => e.stopPropagation()}>
            <h3>Nova Meta</h3>
            <input
              className="goals-input"
              placeholder="Título da meta"
              value={newGoal.title}
              onChange={e => setNewGoal(p => ({ ...p, title: e.target.value }))}
            />
            <input
              className="goals-input"
              placeholder="Valor alvo (ex: 1200)"
              type="number"
              value={newGoal.target}
              onChange={e => setNewGoal(p => ({ ...p, target: e.target.value }))}
            />
            <input
              className="goals-input"
              placeholder="Unidade (ex: pontos, partidas)"
              value={newGoal.unit}
              onChange={e => setNewGoal(p => ({ ...p, unit: e.target.value }))}
            />
            <div className="goals-modal-actions">
              <button className="goals-modal-cancel" onClick={() => setShowAddModal(false)}>Cancelar</button>
              <button className="goals-modal-save" onClick={handleAddGoal}>Criar Meta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
