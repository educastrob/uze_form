import React, { useState } from 'react';
import { UserRound, Mail, Phone, UserSquare2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  cpf: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    cpf: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados do formulário:', formData);
    alert('Contato registrado com sucesso!');
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex justify-center mb-6">
          <div className="bg-[#4B2E83] w-24 h-24 rounded-2xl flex items-center justify-center">
            <div className="text-white text-4xl font-bold tracking-wider">
              uze
              <div className="w-6 h-1.5 bg-white rounded-full mx-auto mt-1"></div>
            </div>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Registro de Contato
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserRound className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Nome Completo"
              className="block w-full pl-10 pr-3 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="block w-full pl-10 pr-3 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Telefone"
              maxLength={15}
              className="block w-full pl-10 pr-3 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserSquare2 className="h-5 w-5 text-purple-400" />
            </div>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              placeholder="CPF"
              maxLength={14}
              className="block w-full pl-10 pr-3 py-2.5 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#4B2E83] text-white py-2.5 px-4 rounded-lg hover:bg-[#3b2366] focus:ring-4 focus:ring-purple-300 transition duration-200"
          >
            Registrar Contato
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;