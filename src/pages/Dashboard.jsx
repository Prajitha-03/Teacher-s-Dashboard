import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';

const Dashboard = () => {
  const [stats] = useState([
    { name: 'Total Students', value: 42, change: '+3', changeType: 'positive' },
    { name: 'Active Lessons', value: 18, change: '+2', changeType: 'positive' },
    { name: 'Quizzes Graded', value: 127, change: '+12', changeType: 'positive' },
    { name: 'Avg. Quiz Score', value: '84%', change: '+2%', changeType: 'positive' },
  ]);

  const [recentStudents, setRecentStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentStudents = async () => {
      try {
        const response = await axios.get('/data/students.json');
         setRecentStudents(response.data.students.slice(0, 7));
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRecentStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <p>Loading recent students...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64 text-red-500">
              <p>Error loading recent students: {error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />
        <main className="p-6">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.name} className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{stat.value}</p>
                <p className={`mt-1 text-sm ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last week
                </p>
              </div>
            ))}
          </div>

          {/* Recent Students */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Students</h2>
            {recentStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentStudents.map((student) => (
                  <StudentCard 
                    key={student.id} 
                    student={{
                      ...student,
                      email: `${student.name.replace(' ', '.').toLowerCase()}@school.edu`,
                      status: 'active' // Default status since not in JSON
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent students found
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;