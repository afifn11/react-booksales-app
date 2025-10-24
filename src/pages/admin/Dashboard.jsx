import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import Card from '../../components/ui/Card';

const Dashboard = () => {
  const stats = [
    { name: 'Total Books', value: '1,234', change: '+12%', changeType: 'increase' },
    { name: 'Total Authors', value: '89', change: '+5%', changeType: 'increase' },
    { name: 'Total Genres', value: '15', change: '+2%', changeType: 'increase' },
    { name: 'Total Revenue', value: '₦45.2M', change: '+18%', changeType: 'increase' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.name} className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
                <div className={`flex-shrink-0 px-2 py-1 text-sm rounded-full ${
                  stat.changeType === 'increase' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">No recent transactions</p>
              </div>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            </Card.Header>
            <Card.Body>
              <div className="space-y-3">
                <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                  <span className="text-blue-700 font-medium">Add New Book</span>
                </button>
                <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                  <span className="text-green-700 font-medium">Manage Authors</span>
                </button>
                <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                  <span className="text-purple-700 font-medium">View Reports</span>
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;