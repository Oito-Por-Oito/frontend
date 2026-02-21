import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from '@/hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        if (signInError.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos.');
        } else if (signInError.message.includes('Email not confirmed')) {
          setError('Por favor, confirme seu email antes de fazer login.');
        } else {
          setError(signInError.message);
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) {
        setError(googleError.message);
      }
    } catch (err) {
      setError('Erro ao conectar com Google.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-secondary via-surface-primary to-gold/10 text-foreground">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-[380px] mx-4"
      >
        <Card variant="elevated" className="border-2 border-gold/40 px-6 sm:px-8 py-10 flex flex-col items-center">
          {/* Sign Up link no topo direito */}
          <a
            href="/signup"
            className="absolute top-5 right-7 text-sm text-gold font-semibold hover:underline"
          >
            Sign Up
          </a>

          {/* Logo + Título */}
          <div className="text-center mb-6">
            <img
              src="/assets/logo.png"
              alt="Logo OitoPorOito"
              className="w-16 mx-auto mb-3 drop-shadow-lg rounded-full border border-gold bg-surface-secondary p-1"
            />
            <h1 className="text-2xl font-bold text-gold">Log In to Your Account</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Formulário de login */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full mb-2">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
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
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <label className="flex items-center gap-1">
                <input type="checkbox" className="form-checkbox accent-gold" />
                Remember me
              </label>
              <a href="/forgot-password" className="hover:underline text-gold">
                Forgot Password?
              </a>
            </div>

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          {/* Separador */}
          <div className="text-center text-muted-foreground text-sm mb-2">OR</div>

          {/* Botões sociais */}
          <div className="space-y-2 w-full">
            <Button 
              variant="secondary" 
              className="w-full justify-center"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Google-g-icon.png"
                alt="Google"
                className="w-5 h-5 mr-3"
              />
              Log in with Google
            </Button>
            <Button 
              variant="secondary" 
              className="w-full justify-center opacity-50 cursor-not-allowed"
              disabled
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg"
                alt="Apple"
                className="w-5 h-6 mr-3"
              />
              Log in with Apple (Coming Soon)
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-5">
            New here?{' '}
            <a href="/signup" className="text-gold font-medium hover:underline">
              Sign up
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
