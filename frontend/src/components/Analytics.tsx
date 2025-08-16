import React from 'react';

const Analytics: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Analytics</h2>
        <p className="text-gray-600">Advanced risk analysis and performance metrics</p>
      </div>

      {/* Risk Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">18.5%</div>
            <div className="text-sm text-gray-600 mt-1">Portfolio Volatility</div>
            <div className="text-xs text-gray-500 mt-2">30-day rolling</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">1.12</div>
            <div className="text-sm text-gray-600 mt-1">Beta</div>
            <div className="text-xs text-gray-500 mt-2">vs S&P 500</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">1.68</div>
            <div className="text-sm text-gray-600 mt-1">Sortino Ratio</div>
            <div className="text-xs text-gray-500 mt-2">Downside risk adjusted</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">-12.3%</div>
            <div className="text-sm text-gray-600 mt-1">Max Drawdown</div>
            <div className="text-xs text-gray-500 mt-2">Peak to trough</div>
          </div>
        </div>
      </div>

      {/* Risk Analysis Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <p className="text-gray-500">Risk distribution chart</p>
              <p className="text-sm text-gray-400">Interactive chart would display here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Correlation Matrix</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-gray-400 mb-2">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
                </svg>
              </div>
              <p className="text-gray-500">Asset correlation heatmap</p>
              <p className="text-sm text-gray-400">Interactive heatmap would display here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Value at Risk Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Value at Risk (VaR) Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-2xl font-bold text-red-600">-$3,245</div>
            <div className="text-sm text-gray-600 mt-1">1-Day VaR (95%)</div>
            <div className="text-xs text-gray-500 mt-2">Maximum expected loss</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">-$7,890</div>
            <div className="text-sm text-gray-600 mt-1">1-Week VaR (95%)</div>
            <div className="text-xs text-gray-500 mt-2">Weekly risk exposure</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">-$15,420</div>
            <div className="text-sm text-gray-600 mt-1">1-Month VaR (95%)</div>
            <div className="text-xs text-gray-500 mt-2">Monthly risk exposure</div>
          </div>
        </div>
      </div>

      {/* Performance Attribution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Attribution</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contribution</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Contribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Technology</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+12.8%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+5.79%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">38.5%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Healthcare</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+8.4%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+1.86%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18.2%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Financial</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">18.3%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+6.2%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+1.13%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">22.8%</td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Energy</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">14.4%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-3.1%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-0.45%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">20.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
