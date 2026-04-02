import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAllUserUrls, deleteUserUrl } from '../api/user.api';
import UrlForm from '../components/UrlForm';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserUrls();
  }, []);

  const fetchUserUrls = async () => {
    try {
      setLoading(true);
      const response = await getAllUserUrls();
      setUrls(response.urls || []);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = () => {
    fetchUserUrls(); // Refresh the list when a new URL is created
  };

  const handleDeleteUrl = async (urlId) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) {
      return;
    }

    try {
      await deleteUserUrl(urlId);
      fetchUserUrls(); // Refresh the list after deletion
    } catch (err) {
      setError(err.message || 'Failed to delete URL');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Manage your shortened URLs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* URL Creation Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Create New URL</h2>
            <UrlForm onUrlCreated={handleUrlCreated} />
          </div>

          {/* User URLs List */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Your URLs</h2>
            
            {loading && (
              <div className="text-center py-4">
                <p className="text-gray-600">Loading your URLs...</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {error}
              </div>
            )}

            {!loading && !error && urls.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">You haven't created any URLs yet.</p>
                <p className="text-gray-500 text-sm mt-2">Create your first shortened URL using the form!</p>
              </div>
            )}

            {!loading && !error && urls.length > 0 && (
              <div className="space-y-3">
                {urls.map((url) => (
                  <div key={url._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {url.full_url}
                        </p>
                        <p className="text-sm text-blue-600 hover:text-blue-800">
                          {url.backend_url || `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/${url.short_url}`}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Clicks: {url.clicks || 0}
                        </p>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(url.backend_url || `${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/${url.short_url}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Copy
                        </button>
                        <button
                          onClick={() => handleDeleteUrl(url._id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
