import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData.email, formData.password);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#4B2E83] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-md p-8 rounded-3xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="bg-[#4B2E83] w-20 h-20 rounded-2xl flex items-center justify-center transform -rotate-12 hover:rotate-0 transition-transform duration-300">
            <div className="text-white text-3xl font-bold tracking-wider">
              uze
              <div className="w-5 h-1 bg-white rounded-full mx-auto mt-1"></div>
            </div>
          </div>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#4B2E83] to-purple-600 inline-block text-transparent bg-clip-text">
            Login
          </h1>
          <p className="text-gray-600 mt-2">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Email"
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Senha"
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4B2E83] text-white mt-8 py-4 px-6 rounded-xl text-lg font-semibold hover:bg-[#3b2366] transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-purple-300/50"
          >
            Entrar
          </button>
        </form>

        <p className="text-center mt-8 text-gray-600">
          Não tem uma conta?{' '}
          <Link to="/register" className="text-[#4B2E83] font-semibold hover:underline">
            Registre-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;