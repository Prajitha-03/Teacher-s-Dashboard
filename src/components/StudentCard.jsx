import { Link } from 'react-router-dom';

const StudentCard = ({ student, onEdit, onDelete }) => {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Top section: Avatar, Name, Status */}
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {student.name?.charAt(0) || 'S'}
          </div>
          <div className="ml-4 flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
                <p className="text-sm text-gray-500">{student.class || 'Unknown Class'}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[student.status] || 'bg-gray-100 text-gray-800'
                  }`}
              >
                {student.status || 'unknown'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">ID: {student.id}</p>
          </div>
        </div>
      </div>

      {/* Bottom action section */}
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-between items-center">
          <Link
            to={`/students/${student.id}`}
            className="px-3 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200 transition-colors"
          >
            View Details
          </Link>
          <div className="flex space-x-2">
            <Link to={`/students/update/${student.id}`} className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
              Edit
            </Link>
            <button
              onClick={() => onDelete(student)}
              className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
