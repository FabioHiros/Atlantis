import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBed, FaCalendarAlt, FaBars, FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close sidebar when screen grows beyond md breakpoint
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar');
      if (isMobileMenuOpen && sidebar && !sidebar.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-40 bg-blue-600 text-white p-2  rounded-md"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`bg-blue-800 text-white fixed md:relative inset-y-0 left-0 z-30 w-64 py-6 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } md:transition-none`}
      >
        <div className="px-6">
          <h1 className="text-2xl font-bold mb-1">Atlantis</h1>
          <p className="text-blue-200 text-sm">Sistema de Gestão</p>
        </div>
        
        <nav className="mt-10 px-6 flex-1">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
            end
          >
            <FaHome className="mr-3" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink 
            to="/clientes" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaUsers className="mr-3" />
            <span>Clientes</span>
          </NavLink>
          
          <NavLink 
            to="/acomodacoes" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaBed className="mr-3" />
            <span>Acomodações</span>
          </NavLink>
          
          <NavLink 
            to="/estadias" 
            className={({ isActive }) => 
              `flex items-center py-3 px-4 rounded transition-colors ${
                isActive ? 'bg-blue-700' : 'hover:bg-blue-700'
              }`
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaCalendarAlt className="mr-3" />
            <span>Estadias</span>
          </NavLink>
        </nav>
        
        <div className="mt-auto px-6 py-4">
          <div className="bg-blue-900 rounded p-4 text-center">
            <h3 className="text-blue-300 text-sm font-medium">Atlantis Resort</h3>
            <p className="text-xs mt-1 text-blue-200">Sistema de Gestão v1.0</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;