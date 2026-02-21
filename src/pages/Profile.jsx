import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Card } from "@/components/ui";
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile, loading, updateProfile, refreshProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || '');
      setUsername(profile.username || '');
      setBio(profile.bio || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione uma imagem.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 2MB.');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await updateProfile({ avatar_url: publicUrl });
      
      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      setSuccess('Avatar atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Erro ao fazer upload do avatar.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      if (username.length < 3) {
        throw new Error('Username deve ter pelo menos 3 caracteres.');
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error('Username pode conter apenas letras, números e underscore.');
      }

      const { error: updateError } = await updateProfile({
        display_name: displayName,
        username: username,
        bio: bio,
      });

      if (updateError) throw updateError;

      setSuccess('Perfil atualizado com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-gold text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-secondary via-surface-primary to-surface-secondary text-foreground">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gold mb-8">Meu Perfil</h1>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Avatar Section */}
            <Card variant="elevated" className="border border-gold/30 p-6 flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gold bg-surface-tertiary">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl text-muted-foreground">
                      👤
                    </div>
                  )}
                </div>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full">
                    <div className="text-gold">Uploading...</div>
                  </div>
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
              />
              
              <Button 
                variant="secondary" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mb-4"
              >
                {uploading ? 'Uploading...' : 'Alterar Avatar'}
              </Button>
              
              <p className="text-xs text-muted-foreground text-center">
                Imagem até 2MB (JPG, PNG, GIF)
              </p>
            </Card>

            {/* Profile Form */}
            <Card variant="elevated" className="border border-gold/30 p-6 md:col-span-2">
              {error && (
                <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Display Name
                  </label>
                  <Input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Seu nome de exibição"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="seu_username"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Bio
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Conte um pouco sobre você..."
                    disabled={saving}
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-surface-tertiary border border-gold/30 
                               text-foreground placeholder:text-muted-foreground 
                               focus:ring-2 focus:ring-gold focus:outline-none resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="opacity-50"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    O email não pode ser alterado.
                  </p>
                </div>

                <Button 
                  variant="primary" 
                  type="submit" 
                  className="w-full"
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </Card>

            {/* Stats Section */}
            <Card variant="elevated" className="border border-gold/30 p-6 md:col-span-3">
              <h2 className="text-xl font-bold text-gold mb-4">Estatísticas</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-surface-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-gold">{profile?.rating_blitz || 800}</div>
                  <div className="text-sm text-muted-foreground">Rating Blitz</div>
                </div>
                <div className="text-center p-4 bg-surface-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-gold">{profile?.rating_rapid || 800}</div>
                  <div className="text-sm text-muted-foreground">Rating Rápido</div>
                </div>
                <div className="text-center p-4 bg-surface-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-gold">{profile?.rating_classical || 800}</div>
                  <div className="text-sm text-muted-foreground">Rating Clássico</div>
                </div>
                <div className="text-center p-4 bg-surface-tertiary rounded-lg">
                  <div className="text-2xl font-bold text-gold">{profile?.puzzles_solved || 0}</div>
                  <div className="text-sm text-muted-foreground">Puzzles Resolvidos</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-4 bg-green-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{profile?.wins || 0}</div>
                  <div className="text-sm text-muted-foreground">Vitórias</div>
                </div>
                <div className="text-center p-4 bg-gray-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-gray-400">{profile?.draws || 0}</div>
                  <div className="text-sm text-muted-foreground">Empates</div>
                </div>
                <div className="text-center p-4 bg-red-500/20 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">{profile?.losses || 0}</div>
                  <div className="text-sm text-muted-foreground">Derrotas</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
