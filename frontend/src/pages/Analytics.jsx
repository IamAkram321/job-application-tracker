import { useApplications } from "../contexts/ApplicationContext";
import PieChartStatus from "../components/PieChartStatus";
import LineChartTrend from "../components/LineChartTrend";
import BarChartCompanies from "../components/BarChartCompanies";
import { BarChart3, TrendingUp, IndianRupee , Clock } from "lucide-react";

export default function Analytics() {
  const { applications, stats } = useApplications();

  // Generate trend data for the last 30 days
  const generateTrendData = () => {
    const days = 30;
    const today = new Date();
    const trendData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const count = applications.filter(
        (app) => app.appliedDate <= dateStr
      ).length;

      trendData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        applications: count,
      });
    }

    return trendData;
  };

  // Generate company data
  const generateCompanyData = () => {
    const companyCount = {};
    
    applications.forEach((app) => {
      companyCount[app.company] = (companyCount[app.company] || 0) + 1;
    });

    return Object.entries(companyCount)
      .map(([company, count]) => ({ company, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const trendData = generateTrendData();
  const companyData = generateCompanyData();

  // Calculate additional metrics
  const totalSalary = applications
    .filter((app) => app.salary)
    .reduce((sum, app) => sum + app.salary, 0);
  
  const avgSalary = applications.filter((app) => app.salary).length > 0
    ? Math.round(totalSalary / applications.filter((app) => app.salary).length)
    : 0;

  const avgResponseTime = 14; // Mock data

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Insights and trends from your job applications
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-3xl font-bold">{stats.total}</h3>
          <p className="text-blue-100">Total Applications</p>
        </div>

        <div className="bg-linear-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <IndianRupee className="w-8 h-8" />
            <TrendingUp className="w-6 h-6 opacity-75" />
          </div>
          <h3 className="text-3xl font-bold">
            Rs. {avgSalary > 0 ? (avgSalary / 1000).toFixed(0) + 'k' : 'N/A'}
          </h3>
          <p className="text-green-100">Average Salary</p>
        </div>

        <div className="bg-linear-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold">
            {stats.total > 0
              ? Math.round(((stats.interview + stats.offer) / stats.total) * 100)
              : 0}%
          </h3>
          <p className="text-purple-100">Response Rate</p>
        </div>

        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-3xl font-bold">{avgResponseTime}</h3>
          <p className="text-orange-100">Avg Response (days)</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartStatus data={stats} />
        <LineChartTrend data={trendData} />
      </div>

      {/* Company Chart */}
      <div className="grid grid-cols-1 gap-6">
        <BarChartCompanies data={companyData} />
      </div>

      {/* Additional Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Roles</h2>
          <div className="space-y-3">
            {["Frontend Developer", "Full Stack Developer", "Software Engineer"]
              .map((role, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-gray-700">{role}</span>
                  </div>
                  <span className="text-gray-600 font-medium">
                    {applications.filter((app) => app.role === role).length}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Success Rate</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Offers</span>
                <span className="text-gray-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.offer / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.round((stats.offer / stats.total) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Interviews</span>
                <span className="text-gray-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.interview / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.round((stats.interview / stats.total) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-700">Rejected</span>
                <span className="text-gray-600 font-medium">
                  {stats.total > 0
                    ? Math.round((stats.rejected / stats.total) * 100)
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${
                      stats.total > 0
                        ? Math.round((stats.rejected / stats.total) * 100)
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
