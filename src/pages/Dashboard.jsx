import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [recentStudents, setRecentStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, coursesRes] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/courses'),
        ]);

        setRecentStudents(studentsRes.data);
        setCourses(coursesRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (courses.length > 0 && recentStudents.length > 0) {
      setStats([
        {
          name: 'Total Students',
          value: recentStudents.length,
          change: '+3',
          changeType: 'positive'
        },
        {
          name: 'Active Courses',
          value: courses.length,
          change: '+1',
          changeType: 'positive'
        },
        {
          name: 'Total Lessons',
          value: courses.reduce((acc, course) =>
            acc + course.units.reduce((unitAcc, unit) =>
              unitAcc + unit.lessons.length, 0), 0),
          change: '+5',
          changeType: 'positive'
        },
        {
          name: 'Avg. Students/Course',
          value: Math.round(recentStudents.length / courses.length),
          change: '+2',
          changeType: 'positive'
        },
      ]);
    }
  }, [courses, recentStudents]);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <p>Loading data...</p>
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
              <p>Error loading data: {error}</p>
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

          {/* Courses Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Link
                  to={`/courses/${course.id}`}
                  key={course.id}
                  className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {course.units.length} units, {course.units.reduce((acc, unit) => acc + unit.lessons.length, 0)} lessons
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Students */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Students</h2>
            {recentStudents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recentStudents.slice(0, 3).map((student) => (
                  <StudentCard
                    key={student.id}
                    student={{
                      ...student,
                      email: `${student.name.replace(' ', '.').toLowerCase()}@school.edu`,
                      status: 'active'
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
