import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        setError(resetError.message);
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError('Erro ao enviar email. Tente novamente.');
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
            <div className="text-3xl sm:text-5xl mb-4">📧</div>
            <h1 className="text-2xl font-bold text-gold mb-4">Email Enviado!</h1>
            <p className="text-muted-foreground mb-6">
              Se existe uma conta com o email <span className="text-gold">{email}</span>, 
              você receberá um link para redefinir sua senha.
            </p>
            <a href="/login" className="w-full">
              <Button variant="secondary" className="w-full">
                Voltar para Login
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
          {/* Back to Login */}
          <a
            href="/login"
            className="absolute top-5 left-7 text-sm text-gold font-semibold hover:underline"
          >
            ← Back
          </a>

          {/* Logo + Título */}
          <div className="text-center mb-6">
            <img
              src="/assets/logo.png"
              alt="Logo OitoPorOito"
              className="w-16 mx-auto mb-3 drop-shadow-lg rounded-full border border-gold bg-surface-secondary p-1"
            />
            <h1 className="text-2xl font-bold text-gold">Forgot Password?</h1>
            <p className="text-muted-foreground text-sm mt-2">
              Digite seu email e enviaremos um link para redefinir sua senha.
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
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              {loading ? 'Sending...' : 'Send Reset Link'}
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
