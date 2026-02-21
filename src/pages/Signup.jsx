import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from '@/hooks/useAuth';

export default function Signup() {
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (username.length < 3) {
      setError('Username deve ter pelo menos 3 caracteres.');
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username pode conter apenas letras, números e underscore.');
      return false;
    }
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres.');
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
      const { data, error: signUpError } = await signUp(email, password, {
        username: username,
        display_name: username,
      });
      
      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('Este email já está cadastrado.');
        } else {
          setError(signUpError.message);
        }
      } else if (data?.user) {
        if (data.user.identities?.length === 0) {
          setError('Este email já está cadastrado.');
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
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
            <div className="text-3xl sm:text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gold mb-4">Verifique seu Email</h1>
            <p className="text-muted-foreground mb-6">
              Enviamos um link de confirmação para <span className="text-gold">{email}</span>. 
              Clique no link para ativar sua conta.
            </p>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/login')}
              className="w-full"
            >
              Voltar para Login
            </Button>
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
          {/* Log In link no topo direito */}
          <a
            href="/login"
            className="absolute top-5 right-7 text-sm text-gold font-semibold hover:underline"
          >
            Log In
          </a>

          {/* Logo + Título */}
          <div className="text-center mb-6">
            <img
              src="/assets/logo.png"
              alt="Logo OitoPorOito"
              className="w-16 mx-auto mb-3 drop-shadow-lg rounded-full border border-gold bg-surface-secondary p-1"
            />
            <h1 className="text-2xl font-bold text-gold">Create Your Account</h1>
          </div>

          {/* Error message */}
          {error && (
            <div className="w-full mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Formulário de cadastro */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full mb-2">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
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
                placeholder="Password (min. 6 characters)"
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

            <Button 
              variant="primary" 
              size="lg" 
              className="w-full" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          {/* Separador */}
          <div className="text-center text-muted-foreground text-sm mb-2">OR</div>

          {/* Botões sociais */}
          <div className="space-y-2 w-full">
            <Button 
              variant="secondary" 
              className="w-full justify-center"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Google-g-icon.png"
                alt="Google"
                className="w-5 h-5 mr-3"
              />
              Sign up with Google
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
              Sign up with Apple (Coming Soon)
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{' '}
            <a href="/login" className="text-gold font-medium hover:underline">
              Log in
            </a>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
