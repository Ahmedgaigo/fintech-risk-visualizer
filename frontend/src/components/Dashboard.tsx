import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Portfolio Overview</h2>
        <p className="text-gray-600">Real-time portfolio analysis and risk metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">$127,450.32</p>
              <p className="text-sm text-green-600">+2.4% today</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total P&L</p>
              <p className="text-2xl font-bold text-green-600">+$12,450.32</p>
              <p className="text-sm text-gray-600">+10.8% return</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Sharpe Ratio</p>
              <p className="text-2xl font-bold text-gray-900">1.42</p>
              <p className="text-sm text-gray-600">Risk-adjusted return</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">VaR (95%)</p>
              <p className="text-2xl font-bold text-red-600">-$3,245.12</p>
              <p className="text-sm text-gray-600">Daily risk</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Portfolio Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Portfolio Performance Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Portfolio Performance</h3>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">1M</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">3M</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md">1Y</button>
              </div>
            </div>
            <div className="h-64">
              {/* Performance Chart Visualization */}
              <div className="h-full bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-4 relative overflow-hidden">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  {/* Grid lines */}
                  <defs>
                    <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                  
                  {/* Performance line */}
                  <path
                    d="M 20 160 Q 60 140 100 120 T 180 100 T 260 80 T 340 60 T 380 50"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  
                  {/* Data points */}
                  <circle cx="100" cy="120" r="4" fill="#3b82f6" />
                  <circle cx="180" cy="100" r="4" fill="#3b82f6" />
                  <circle cx="260" cy="80" r="4" fill="#3b82f6" />
                  <circle cx="340" cy="60" r="4" fill="#3b82f6" />
                  
                  {/* Y-axis labels */}
                  <text x="10" y="50" fontSize="10" fill="#6b7280">$130k</text>
                  <text x="10" y="100" fontSize="10" fill="#6b7280">$120k</text>
                  <text x="10" y="150" fontSize="10" fill="#6b7280">$110k</text>
                  
                  {/* X-axis labels */}
                  <text x="50" y="190" fontSize="10" fill="#6b7280">Jan</text>
                  <text x="150" y="190" fontSize="10" fill="#6b7280">Mar</text>
                  <text x="250" y="190" fontSize="10" fill="#6b7280">May</text>
                  <text x="350" y="190" fontSize="10" fill="#6b7280">Jul</text>
                </svg>
                
                {/* Performance indicator */}
                <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm p-3">
                  <div className="text-sm text-gray-600">Current Value</div>
                  <div className="text-lg font-bold text-gray-900">$127,450</div>
                  <div className="text-sm text-green-600">+10.8% YTD</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Asset Allocation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Asset Allocation</h3>
          <div className="h-64 flex items-center justify-center relative">
            {/* Donut Chart */}
            <svg className="w-48 h-48" viewBox="0 0 200 200">
              {/* Background circle */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="20"/>
              
              {/* AAPL - 25.4% */}
              <circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#3b82f6" strokeWidth="20"
                strokeDasharray="127 373"
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
              
              {/* GOOGL - 18.7% */}
              <circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#10b981" strokeWidth="20"
                strokeDasharray="94 406"
                strokeDashoffset="-127"
                transform="rotate(-90 100 100)"
              />
              
              {/* MSFT - 22.1% */}
              <circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#8b5cf6" strokeWidth="20"
                strokeDasharray="111 389"
                strokeDashoffset="-221"
                transform="rotate(-90 100 100)"
              />
              
              {/* TSLA - 15.3% */}
              <circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#f59e0b" strokeWidth="20"
                strokeDasharray="77 423"
                strokeDashoffset="-332"
                transform="rotate(-90 100 100)"
              />
              
              {/* Others - 18.5% */}
              <circle
                cx="100" cy="100" r="80"
                fill="none" stroke="#ef4444" strokeWidth="20"
                strokeDasharray="93 407"
                strokeDashoffset="-409"
                transform="rotate(-90 100 100)"
              />
              
              {/* Center text */}
              <text x="100" y="95" textAnchor="middle" fontSize="14" fill="#374151" fontWeight="600">Total</text>
              <text x="100" y="110" textAnchor="middle" fontSize="12" fill="#6b7280">$127.4k</text>
            </svg>
          </div>
          
          {/* Legend */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">AAPL</span>
              </div>
              <span className="text-sm font-medium">25.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">GOOGL</span>
              </div>
              <span className="text-sm font-medium">18.7%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">MSFT</span>
              </div>
              <span className="text-sm font-medium">22.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">TSLA</span>
              </div>
              <span className="text-sm font-medium">15.3%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Others</span>
              </div>
              <span className="text-sm font-medium">18.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Current Holdings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P&L</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">AAPL</div>
                    <div className="text-sm text-gray-500">Apple Inc.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">150</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$175.23</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$26,284.50</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$2,284.50</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+2.1%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">GOOGL</div>
                    <div className="text-sm text-gray-500">Alphabet Inc.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">75</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$142.85</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$10,713.75</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$1,213.75</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+1.8%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">MSFT</div>
                    <div className="text-sm text-gray-500">Microsoft Corp.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">80</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$378.92</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$30,313.60</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$3,313.60</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+3.2%</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">TSLA</div>
                    <div className="text-sm text-gray-500">Tesla Inc.</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">45</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$248.73</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">$11,192.85</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$807.15</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-1.4%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Added AAPL to Tech Portfolio</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <span className="text-sm text-green-600">+$2,500</span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Risk analysis completed</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <span className="text-sm text-gray-600">Sharpe: 1.42</span>
          </div>
          
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Portfolio rebalancing suggested</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
            <span className="text-sm text-yellow-600">Review</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
