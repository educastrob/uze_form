import React, { createContext, useContext, useState } from 'react';
import api from "../servers/api/api.ts";
import axios from "axios";
import { toast } from "react-toastify";

interface IRegisterForm  {
	name: string;
	email: string;
	password: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: { email: string } | null;
  login: (email: string, password: string) => void;
  register: (dataRegister: IRegisterForm) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);

  const login = async (email: string, password: string) => {
	// logic
    setIsAuthenticated(true);
    setUser({ email });
  };

  const register = async (dataRegister: IRegisterForm) => {
	const { name, email, password } = dataRegister;
  
	try {
	  const axiosResponse = await api.post("/api/register", { name, email, password });
  
	  // Lida com uma resposta de sucesso
	  console.log("Usuário registrado com sucesso:", axiosResponse.data);
  
	  // Configurações de autenticação
	  setIsAuthenticated(true);
	  setUser({ email });
	} catch (error) {
	  // Verifica se o erro é do Axios
	  if (axios.isAxiosError(error)) {
		if (error.response?.status === 400) {
		  console.error("Erro 400:", error.response.data.message);
		  toast.error(error.response.data.message, {
			position: "top-center",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: false,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "light",
			});
		}
	  } else {
		console.error("Erro inesperado:", error);
		console.log(error);
	  }
	}
  };  

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}