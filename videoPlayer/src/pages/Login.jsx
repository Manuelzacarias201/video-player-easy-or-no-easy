import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const NetflixLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAnimating(true);
    setError('');
    
    try {
      const response = await fetch('http://127.0.0.1:3000/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password_hash: password
        }),
      });
      
      if (response.ok) {
        const authHeader = response.headers.get('Authorization');
        const token = authHeader ? authHeader.replace('Bearer ', '') : '';
        const userData = await response.json();
        
        localStorage.setItem('authToken', token);
        
        if (userData && userData.data && userData.data.attributes) {
          localStorage.setItem('userName', userData.data.attributes.full_name);
          localStorage.setItem('userEmail', userData.data.attributes.email);
          localStorage.setItem('userId', userData.data.id);
        }
        
        navigate('/home');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      setError('Error de conexión. Por favor intenta de nuevo.');
      console.error('Login error:', error);
    } finally {
      setIsAnimating(false);
    }
  };
  
  return (
    <div className="relative flex items-center justify-center min-h-screen w-full">
      <div className="absolute inset-0 bg-cover bg-center" style={{ 
        backgroundImage: 'url(/wallpaperMiko.jpg)', 
        filter: 'brightness(40%)' 
      }}></div>
      
      <div className="absolute inset-0 bg-black opacity-60"></div>
      
      
      
      <div className={`relative z-10 bg-black bg-opacity-75 rounded-md overflow-hidden w-full max-w-md p-16 transform transition-all duration-500 border border-gray-800 ${isAnimating ? 'scale-105' : 'scale-100'}`}>
        <div className="mb-8">
          <h1 className="font-bold text-3xl text-white mb-6" >Inicia sesión</h1>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-900 bg-opacity-50 text-red-200 rounded text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-6 flex flex-col gap-6">
          <div>
            <div className={`gap-6 relative transform transition-all duration-300 ${isAnimating ? 'translate-y-1' : ''}`}>
              <input
                id="email"
                type="email"
                className="form-input mt-6 w-full px-5 py-4 bg-gray-800 text-gray-200 rounded text-base focus:ring-1 focus:ring-red-600 focus:outline-none placeholder-gray-500 border-none"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <div className="relative">
              <div className={`transform transition-all duration-300 ${isAnimating ? 'translate-y-1' : ''}`}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="form-input w-full px-5 py-4 bg-gray-800 text-gray-200 rounded text-base focus:ring-1 focus:ring-red-600 focus:outline-none placeholder-gray-500 border-none pr-12"
                  placeholder="Contraseña"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              className={`w-full flex justify-center items-center px-4 py-3 bg-blue-800 text-white font-medium rounded hover:bg-blue-700 focus:outline-none transform transition-all duration-300 ${
                isAnimating ? 'scale-95 bg-blue-700' : ''
              }`}
            >
              Iniciar Sesión
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              
              <label htmlFor="remember" className="ml-2 block text-sm text-gray-400">
              </label>
            </div>
            <div className="text-sm">
        
            </div>
          </div>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-gray-500 mb-4">
            <Link to="/" className="text-white hover:underline">¿No tienes una cuenta? Regístrate</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NetflixLogin;