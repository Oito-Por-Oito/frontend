import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from '@/hooks/useAuth';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { updatePassword, user } = useAuth();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Check if user came from email link
  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    
    if (!accessToken && !user) {
      // No token and no user, redirect to forgot password
      navigate('/forgot-password');
    }
  }, [navigate, user]);

  const validateForm = () => {
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      const { error: updateError } = await updatePassword(password);
      
      if (updateError) {
        setError(updateError.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError('Erro ao atualizar senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-secondary via-surface-primary to-gold/10 text-foreground">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative w-full max-w-[380px] mx-4"
        >
          <Card variant="elevated" className="border-2 border-gold/40 px-6 sm:px-8 py-10 flex flex-col items-center text-center">
            <div className="text-3xl sm:text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gold mb-4">Senha Atualizada!</h1>
            <p className="text-muted-foreground mb-6">
              Sua senha foi alterada com sucesso. Você será redirecionado para o login...
            </p>
            <a href="/login" className="w-full">
              <Button variant="primary" className="w-full">
                Ir para Login
              </Button>
            </a>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-secondary via-surface-primary to-gold/10 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-[380px] mx-4"
      >
        <Card variant="elevated" className="border-2 border-gold/40 px-6 sm:px-8 py-10 flex flex-col items-center">
          {/* Logo + Título */}
          <div className="text-center mb-6">
            <img
              src="/assets/logo.png"
              alt="Logo OitoPorOito"
              className="w-16 mx-auto mb-3 drop-shadow-lg rounded-full border border-gold bg-surface-secondary p-1"
            />
            <h1 className="text-2xl font-bold text-gold">Reset Your Password</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Digite sua nova senha abaixo.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="New Password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground text-sm"
                type="button"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-5">
            Remember your password?{' '}
            <a href="/login" className="text-gold font-medium hover:underline">
              Log in
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
