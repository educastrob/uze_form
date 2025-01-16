import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ContactForm from './pages/ContactForm';
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
	
  return (
	<>
	<ToastContainer
		position="top-center"
		autoClose={5000}
		hideProgressBar={false}
		newestOnTop={false}
		closeOnClick={false}
		rtl={false}
		pauseOnFocusLoss
		draggable
		pauseOnHover
		theme="light"
	/>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <ContactForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
	</>
  );
}

export default App;