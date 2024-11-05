import React from 'react';
import { UserCircle, Users, CreditCard, BarChart2, Settings, LogOut, Menu, Home } from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem, isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: <Home />, label: 'Home' },
    { icon: <UserCircle />, label: 'Users' },
    { icon: <Users />, label: 'Recruiters' },
    { icon: <CreditCard />, label: 'Plans' },
    { icon: <BarChart2 />, label: 'Usage History' },
    { icon: <Settings />, label: 'Settings' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-16'} h-screen bg-gray-800 text-white p-4 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h2 className="text-2xl font-bold">Admin Portal</h2>}
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700">
          <Menu size={24} />
        </button>
      </div>
      <nav>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-4">
              <button
                className={`flex items-center w-full p-2 rounded ${
                  activeItem === item.label ? 'bg-blue-600' : 'hover:bg-gray-700'
                }`}
                onClick={() => setActiveItem(item.label)}
              >
                {item.icon}
                {isOpen && <span className="ml-2">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="flex items-center w-full p-2 rounded hover:bg-red-600 mt-auto"
        onClick={() => console.log('Logout clicked')}
      >
        <LogOut />
        {isOpen && <span className="ml-2">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;
