import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Welcome back, {user?.name || 'User'}
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Role: <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700 ring-1 ring-inset ring-indigo-700/10 uppercase tracking-wider">{user?.role || 'Guest'}</span>
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 border border-gray-100">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Activity</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Mock stats cards */}
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
            <dt className="truncate text-sm font-medium text-gray-500">
              {user?.role === 'recruiter' ? 'Active Listings' : 'Applied Jobs'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">12</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
            <dt className="truncate text-sm font-medium text-gray-500">
              {user?.role === 'recruiter' ? 'Total Applications' : 'Saved Jobs'}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">48</dd>
          </div>
          <div className="overflow-hidden rounded-lg bg-gray-50 px-4 py-5 sm:p-6 border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
            <dt className="truncate text-sm font-medium text-gray-500">
              Messages
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">3</dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
