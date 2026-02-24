import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../contexts/AuthContext';

const MODES = [
  { key: 'rapid', label: 'Rápido', icon: '🕐', ratingKey: 'rating_rapid' },
  { key: 'blitz', label: 'Blitz', icon: '⚡', ratingKey: 'rating_blitz' },
  { key: 'classical', label: 'Clássico', icon: '♟', ratingKey: 'rating_classical' },
];

export default function Stats() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('rapid');

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setLoading(true);
      const [{ data: prof }, { data: gamesData }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('games').select('*')
          .or(`white_player_id.eq.${user.id},black_player_id.eq.${user.id}`)
          .order('created_at', { ascending: false })
          .limit(100),
      ]);
      setProfile(prof);
      setGames(gamesData || []);
      setLoading(false);
    };
    fetchData();
  }, [user]);

  const getStats = (mode) => {
    const filtered = games.filter(g => g.time_control_category === mode);
    const wins = filtered.filter(g =>
      (g.white_player_id === user?.id && g.result === 'white') ||
      (g.black_player_id === user?.id && g.result === 'black')
    ).length;
    const losses = filtered.filter(g =>
      (g.white_player_id === user?.id && g.result === 'black') ||
      (g.black_player_id === user?.id && g.result === 'white')
    ).length;
    const draws = filtered.filter(g => g.result === 'draw').length;
    const total = filtered.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    return { wins, losses, draws, total, winRate };
  };

  const stats = getStats(activeMode);
  const currentMode = MODES.find(m => m.key === activeMode);
  const rating = profile?.[currentMode?.ratingKey] || 800;

  if (!user) {
    return (
      <div className="stats-page">
        <div className="stats-auth-prompt">
          <span className="stats-auth-icon">📊</span>
          <h2>Faça login para ver suas estatísticas</h2>
          <button onClick={() => navigate('/login')} className="stats-login-btn">Entrar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="stats-page">
      <div className="stats-header">
        <button className="stats-back-btn" onClick={() => navigate(-1)}>← Voltar</button>
        <h1>📊 Estatísticas</h1>
        <p className="stats-subtitle">Análise detalhada do seu desempenho</p>
      </div>

      {/* Mode Selector */}
      <div className="stats-mode-tabs">
        {MODES.map(mode => (
          <button
            key={mode.key}
            className={`stats-mode-tab ${activeMode === mode.key ? 'active' : ''}`}
            onClick={() => setActiveMode(mode.key)}
          >
            {mode.icon} {mode.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="stats-loading">Carregando estatísticas...</div>
      ) : (
        <>
          {/* Rating Card */}
          <div className="stats-rating-card">
            <div className="stats-rating-value">{rating}</div>
            <div className="stats-rating-label">Rating {currentMode?.label}</div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stats-card wins">
              <div className="stats-card-value">{stats.wins}</div>
              <div className="stats-card-label">Vitórias</div>
            </div>
            <div className="stats-card losses">
              <div className="stats-card-value">{stats.losses}</div>
              <div className="stats-card-label">Derrotas</div>
            </div>
            <div className="stats-card draws">
              <div className="stats-card-value">{stats.draws}</div>
              <div className="stats-card-label">Empates</div>
            </div>
            <div className="stats-card total">
              <div className="stats-card-value">{stats.total}</div>
              <div className="stats-card-label">Total</div>
            </div>
          </div>

          {/* Win Rate Bar */}
          <div className="stats-winrate-section">
            <div className="stats-winrate-header">
              <span>Taxa de Vitórias</span>
              <span className="stats-winrate-pct">{stats.winRate}%</span>
            </div>
            <div className="stats-winrate-bar">
              <div className="stats-winrate-fill wins" style={{ width: `${stats.total > 0 ? (stats.wins / stats.total) * 100 : 0}%` }} />
              <div className="stats-winrate-fill draws" style={{ width: `${stats.total > 0 ? (stats.draws / stats.total) * 100 : 0}%` }} />
              <div className="stats-winrate-fill losses" style={{ width: `${stats.total > 0 ? (stats.losses / stats.total) * 100 : 0}%` }} />
            </div>
            <div className="stats-winrate-legend">
              <span className="legend-wins">■ Vitórias</span>
              <span className="legend-draws">■ Empates</span>
              <span className="legend-losses">■ Derrotas</span>
            </div>
          </div>

          {/* All Modes Summary */}
          <div className="stats-all-modes">
            <h3>Resumo por Modalidade</h3>
            {MODES.map(mode => {
              const s = getStats(mode.key);
              const r = profile?.[mode.ratingKey] || 800;
              return (
                <div key={mode.key} className="stats-mode-row">
                  <span className="stats-mode-icon">{mode.icon}</span>
                  <span className="stats-mode-name">{mode.label}</span>
                  <span className="stats-mode-rating">{r}</span>
                  <span className="stats-mode-games">{s.total} partidas</span>
                  <span className="stats-mode-winrate">{s.winRate}% vitórias</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
