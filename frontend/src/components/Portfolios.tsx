import React from 'react';

const Portfolios: React.FC = () => {
  const portfolios = [
    {
      id: 1,
      name: 'Tech Growth Portfolio',
      value: '$85,420.50',
      change: '+3.2%',
      changeValue: '+$2,650.30',
      assets: 8,
      risk: 'Medium',
      sharpe: 1.45,
      isPositive: true
    },
    {
      id: 2,
      name: 'Dividend Income Portfolio',
      value: '$42,029.82',
      change: '+1.8%',
      changeValue: '+$742.15',
      assets: 12,
      risk: 'Low',
      sharpe: 1.12,
      isPositive: true
    },
    {
      id: 3,
      name: 'Crypto Speculation',
      value: '$15,890.45',
      change: '-2.1%',
      changeValue: '-$340.22',
      assets: 5,
      risk: 'High',
      sharpe: 0.89,
      isPositive: false
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Portfolios</h2>
          <p className="text-gray-600">Manage and analyze your investment portfolios</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Create New Portfolio
        </button>
      </div>

      {/* Portfolio Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{portfolio.name}</h3>
              <span className={`px-2 py-1 text-xs rounded-full ${
                portfolio.risk === 'Low' ? 'bg-green-100 text-green-800' :
                portfolio.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {portfolio.risk} Risk
              </span>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-gray-900">{portfolio.value}</p>
                <p className={`text-sm ${portfolio.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {portfolio.change} ({portfolio.changeValue})
                </p>
              </div>
              
              <div className="flex justify-between text-sm text-gray-600">
                <span>{portfolio.assets} Assets</span>
                <span>Sharpe: {portfolio.sharpe}</span>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Performance Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Portfolio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">1D Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">7D Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">30D Change</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sharpe Ratio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Tech Growth Portfolio</div>
                    <div className="text-sm text-gray-500">8 assets</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$85,420.50</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+3.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8.7%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+15.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-700">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Dividend Income Portfolio</div>
                    <div className="text-sm text-gray-500">12 assets</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$42,029.82</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+1.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+4.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+7.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1.12</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-700">Edit</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Crypto Speculation</div>
                    <div className="text-sm text-gray-500">5 assets</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$15,890.45</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-2.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-12.5%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+22.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">0.89</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                  <button className="hover:text-blue-700">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Portfolios;
