import React, { useState } from 'react';
import { UserCircle, Users, CreditCard, BarChart2, Settings, LogOut, Menu, Home } from 'lucide-react';

const Sidebar = ({ activeItem, setActiveItem, isOpen, toggleSidebar }) => {
  const menuItems = [
    { icon: <Home size={24} />, label: 'Home' },
    { icon: <Users size={24} />, label: 'Users' },
    { icon: <UserCircle size={24} />, label: 'Recruiters' },
    { icon: <CreditCard size={24} />, label: 'Plans' },
    { icon: <BarChart2 size={24} />, label: 'Usage History' },
    { icon: <Settings size={24} />, label: 'Settings' },
  ];

  return (
    <div className={`${isOpen ? 'w-64' : 'w-20'} h-screen bg-gray-800 text-white p-4 flex flex-col transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        {isOpen && <h2 className="text-xl font-bold">Admin Portal</h2>}
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-700 focus:outline-none">
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
                {isOpen && <span className="ml-4">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <button
        className="flex items-center w-full p-2 rounded hover:bg-red-600 mt-auto focus:outline-none"
        onClick={() => console.log('Logout clicked')}
      >
        <LogOut />
        {isOpen && <span className="ml-4">Logout</span>}
      </button>
    </div>
  );
};
 export default Sidebar;