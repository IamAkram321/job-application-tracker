import { useState } from "react";
import { useApplications } from "../contexts/ApplicationContext";
import ApplicationModal from "../components/ApplicationModal";
import ApplicationCard from "../components/ApplicationCard";
import { Plus, Search, Filter, Download } from "lucide-react";
import { filterApplications, sortApplications } from "../utils/utils";

export default function Applications() {
  const { applications, addApplication, updateApplication, deleteApplication } = useApplications();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    company: "",
  });
  const [sortBy, setSortBy] = useState("date-desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const handleAddClick = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  const handleEdit = (application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
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

  const handleSave = async (formData) => {
    try {
      if (editingApplication) {
        await updateApplication(editingApplication._id || editingApplication.id, formData);
      } else {
        await addApplication(formData);
      }
      setIsModalOpen(false);
      setEditingApplication(null);
    } catch (error) {
      console.error('Error saving application:', error);
      alert('Failed to save application. Please try again.');
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingApplication(null);
  };

  // Filter and sort applications
  let filteredApplications = applications;

  // Apply search filter
  if (searchTerm) {
    filteredApplications = filteredApplications.filter(
      (app) =>
        app.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Apply filters
  filteredApplications = filterApplications(filteredApplications, filters);

  // Apply sorting
  filteredApplications = sortApplications(filteredApplications, sortBy);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-600 mt-1">
            Manage all your job applications in one place
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Add Application
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies or roles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="company">Company A-Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {filteredApplications.length} application(s) found
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Applications Grid/List */}
      {filteredApplications.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredApplications.map((app) => (
            <ApplicationCard
              key={app._id || app.id}
              application={app}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">
            No applications found matching your filters
          </p>
          <button
            onClick={handleAddClick}
            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            Add your first application
          </button>
        </div>
      )}

      {/* Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={handleClose}
        onSave={handleSave}
        application={editingApplication}
      />
    </div>
  );
}
