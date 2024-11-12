import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, getDummyUsers } from '../store/authStore';
import { LogOut } from 'lucide-react';

export default function UserListPage() {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const users = getDummyUsers().filter((user) => user.id !== currentUser?.id);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="bg-blue-600 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">Available Users</h1>
        <div className="flex items-center space-x-4">
          <span className="text-white">{currentUser?.username}</span>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto mt-8 p-4">
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/chat/${user.id}`)}
              className="bg-gray-800 p-4 rounded-lg flex items-center space-x-4 cursor-pointer hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                {user.username[0]}
              </div>
              <div>
                <h3 className="text-white font-medium">{user.username}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}