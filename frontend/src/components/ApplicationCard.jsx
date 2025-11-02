import { MapPin, Calendar, DollarSign, X, Edit } from "lucide-react";
import { formatDate, getStatusColor } from "../utils/utils";

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all duration-200 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            {application.company}
          </h3>
          <p className="text-gray-600">{application.role}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
            application.status
          )}`}
        >
          {application.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{application.location}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">{formatDate(application.appliedDate)}</span>
        </div>
        {application.salary && (
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span className="text-sm">
              ${application.salary.toLocaleString()}/yr
            </span>
          </div>
        )}
        {application.notes && (
          <p className="text-sm text-gray-600 mt-3 bg-gray-50 p-3 rounded-lg">
            {application.notes}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(application)}
          className="flex-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(application._id || application.id)}
          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

