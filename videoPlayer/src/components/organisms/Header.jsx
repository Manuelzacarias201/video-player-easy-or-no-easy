import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function HeaderComponent() {
  const [activeMenu, setActiveMenu] = useState('Inicio');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  const handleToNavigate = (route) => {
    setActiveMenu(route);
    navigate(route);
  };

  return (
    <header className="mb-5 fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-black/70 to-transparent py-4 px-8">
      <div className="flex items-center justify-between">
        

        <nav className="flex space-x-6 gap-2">
          {[
            { name: 'Inicio', route: '/home' },
            { name: 'Series', route: '/movies' },
          ].map((item) => (
            <button
              key={item.name}
              className={`cursor-pointer
                text-blue-400 text-lg font-sans transition-all duration-300
                ${activeMenu === item.route ? 'font-bold text-white' : 'hover:text-gray-300 opacity-70'}
              `}
              onClick={() => handleToNavigate(item.route)}
            >
              {item.name}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="text-gray-300 hover:bg-transparent hover:text-white px-4 py-2 text-sm cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}

export default HeaderComponent;