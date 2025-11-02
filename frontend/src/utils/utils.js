// Format date utility
export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Get status color utility
export const getStatusColor = (status) => {
  const colors = {
    Applied: "bg-blue-100 text-blue-800 border-blue-200",
    Interview: "bg-purple-100 text-purple-800 border-purple-200",
    Offer: "bg-green-100 text-green-800 border-green-200",
    Rejected: "bg-red-100 text-red-800 border-red-200",
  };
  return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

// Calculate statistics utility
export const calculateStats = (applications) => {
  const stats = {
    total: applications.length,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };

  applications.forEach((app) => {
    if (stats[app.status.toLowerCase()] !== undefined) {
      stats[app.status.toLowerCase()]++;
    }
  });

  return stats;
};

// Filter applications utility
export const filterApplications = (applications, filters) => {
  return applications.filter((app) => {
    // Status filter
    if (filters.status && app.status !== filters.status) {
      return false;
    }

    // Company filter
    if (
      filters.company &&
      !app.company.toLowerCase().includes(filters.company.toLowerCase())
    ) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const appDate = new Date(app.appliedDate);
      const now = new Date();
      const daysDiff = Math.floor((now - appDate) / (1000 * 60 * 60 * 24));

      if (filters.dateRange === "7days" && daysDiff > 7) {
        return false;
      }
      if (filters.dateRange === "30days" && daysDiff > 30) {
        return false;
      }
    }

    return true;
  });
};

// Sort applications utility
export const sortApplications = (applications, sortBy) => {
  const sorted = [...applications];

  switch (sortBy) {
    case "date-desc":
      return sorted.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));
    case "date-asc":
      return sorted.sort((a, b) => new Date(a.appliedDate) - new Date(b.appliedDate));
    case "company":
      return sorted.sort((a, b) => a.company.localeCompare(b.company));
    case "status":
      return sorted.sort((a, b) => a.status.localeCompare(b.status));
    default:
      return sorted;
  }
};






