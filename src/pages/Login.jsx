
import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#232526] via-[#1e1e1e] to-[#c29d5d]/10 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative w-full max-w-[380px] mx-4 bg-[#121212] rounded-2xl shadow-2xl border-2 border-[#c29d5d]/40 px-6 sm:px-8 py-10 flex flex-col items-center"
      >
        {/* Sign Up link no topo direito */}
        <a
          href="/signup"
          className="absolute top-5 right-7 text-sm text-[#c29d5d] font-semibold hover:underline"
        >
          Sign Up
        </a>

        {/* Logo + Título */}
        <div className="text-center mb-6">
          <img
            src="/assets/logo.png"
            alt="Logo OitoPorOito"
            className="w-16 mx-auto mb-3 drop-shadow-lg rounded-full border border-[#c29d5d] bg-[#232526] p-1"
          />
          <h1 className="text-2xl font-bold text-[#c29d5d]">Log In to Your Account</h1>
        </div>

        {/* Formulário de login */}
        <div className="space-y-4 w-full mb-2">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full p-2 bg-[#232526] text-sm text-white rounded-lg border border-[#c29d5d]/30 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full p-2 bg-[#232526] text-sm text-white rounded-lg border border-[#c29d5d]/30 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center text-gray-400 text-sm"
              type="button"
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-400">
            <label className="flex items-center gap-1">
              <input type="checkbox" className="form-checkbox accent-[#c29d5d]" />
              Remember me
            </label>
            <a href="#" className="hover:underline text-[#c29d5d]">
              Forgot Password?
            </a>
          </div>
        </div>

        <button className="w-full bg-gradient-to-r from-[#e7c27d] to-[#c29d5d] text-black py-2.5 rounded-xl text-lg font-bold mb-3 shadow-lg hover:from-[#ffe7b3] hover:to-[#e7c27d] hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#c29d5d]">
          Log In
        </button>

        {/* Separador */}
        <div className="text-center text-gray-500 text-sm mb-2">OR</div>

        {/* Botões sociais */}
        <div className="space-y-2 w-full">
          <button className="flex items-center justify-center w-full bg-[#232526] hover:bg-[#333] border border-[#c29d5d]/30 text-white py-2 rounded-xl text-sm font-semibold">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/d/dc/Google-g-icon.png"
              alt="Google"
              className="w-5 h-5 mr-3"
            />
            Log in with Google
          </button>
          <button className="flex items-center justify-center w-full bg-[#232526] hover:bg-[#333] border border-[#c29d5d]/30 text-white py-2 rounded-xl text-sm font-semibold">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/3/31/Apple_logo_white.svg"
              alt="Apple"
              className="w-5 h-6 mr-3"
            />
            Log in with Apple
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-400 mt-5">
          New here?{' '}
          <a href="/signup" className="text-[#c29d5d] font-medium hover:underline">
            Sign up
          </a>
        </div>
      </motion.div>
    </div>
  );
}
