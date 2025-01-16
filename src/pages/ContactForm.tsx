import React, { useState } from 'react';
import { UserRound, Mail, Phone, UserSquare2, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface FormData {
	fullName: string;
	email: string;
	phone: string;
	cpf: string;
}

function ContactForm() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

	try {
		const response = await fetch('http://localhost:3001/api/contacts', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json',
		  },
		  body: JSON.stringify(formData),
		});
	
		if (!response.ok) {
		  throw new Error('Erro ao registrar contato.');
		}
	
		const data = await response.json();
		console.log('Contato registrado:', data);
		alert('Contato registrado com sucesso!');
		setFormData({
		  fullName: '',
		  email: '',
		  phone: '',
		  cpf: '',
		});
	  } catch (error) {
		console.error(error);
		alert('Erro ao registrar o contato.');
	  }
	};  

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpf') {
      formattedValue = formatCPF(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  return (
    <div className="min-h-screen bg-[#4B2E83] flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm w-full max-w-lg p-8 rounded-3xl shadow-2xl relative">
        <button
          onClick={handleLogout}
          className="absolute top-4 right-4 text-gray-600 hover:text-[#4B2E83] transition-colors"
          title="Sair"
        >
          <LogOut className="h-6 w-6" />
        </button>

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
            Registro de Contato
          </h1>
          <p className="text-gray-600 mt-2">Olá, {user?.email}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserRound className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Nome Completo"
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Telefone"
                maxLength={15}
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <div className="group">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <UserSquare2 className="h-5 w-5 text-[#4B2E83] group-focus-within:text-purple-600 transition-colors" />
              </div>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleInputChange}
                placeholder="CPF"
                maxLength={14}
                className="block w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-[#4B2E83] transition-all duration-200 outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4B2E83] text-white mt-8 py-4 px-6 rounded-xl text-lg font-semibold hover:bg-[#3b2366] transform hover:-translate-y-0.5 transition-all duration-200 focus:ring-4 focus:ring-purple-300/50"
          >
            Registrar Contato
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactForm;