import { Link } from 'react-router-dom';

const StudentCard = ({ student }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {student.name.charAt(0)}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{student.name}</h3>
            <p className="text-sm text-gray-500">{student.class}</p>
            <p className="text-xs text-gray-400 mt-1">ID: {student.id}</p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
        <div className="flex justify-end">
          <Link
            to={`/students/${student.id}`}
            className="px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;