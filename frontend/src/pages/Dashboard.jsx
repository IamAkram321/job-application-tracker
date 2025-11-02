import { useState } from "react";
import { useApplications } from "../contexts/ApplicationContext";
import StatCard from "../components/StatCard";
import PieChartStatus from "../components/PieChartStatus";
import ApplicationCard from "../components/ApplicationCard";
import { Briefcase, Building2, Handshake, XCircle, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { applications, stats, updateApplication, deleteApplication } = useApplications();
  const [editingApplication, setEditingApplication] = useState(null);

  // Get recent applications (last 6)
  const recentApplications = applications.slice(0, 6);

  const handleEdit = (application) => {
    setEditingApplication(application);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await deleteApplication(id);
      } catch (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application. Please try again.');
      }
    }
  };

  const statCards = [
    {
      title: "Total Applications",
      value: stats.total,
      color: "bg-blue-500",
      icon: Briefcase,
      change: 0,
    },
    {
      title: "Interviewing",
      value: stats.interview,
      color: "bg-purple-500",
      icon: Building2,
      change: 0,
    },
    {
      title: "Offers",
      value: stats.offer,
      color: "bg-green-500",
      icon: Handshake,
      change: 0,
    },
    {
      title: "Rejected",
      value: stats.rejected,
      color: "bg-red-500",
      icon: XCircle,
      change: 0,
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your job applications and progress
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieChartStatus data={stats} />
        
        {/* Quick Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quick Insights
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Application Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.applied}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.total > 0
                    ? Math.round(
                        ((stats.interview + stats.offer) / stats.total) * 100
                      )
                    : 0}
                  %
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Recent Applications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentApplications.length > 0 ? (
            recentApplications.map((app) => (
              <ApplicationCard
                key={app._id || app.id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-md">
              <p className="text-gray-600">
                No applications yet. Add your first application!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
