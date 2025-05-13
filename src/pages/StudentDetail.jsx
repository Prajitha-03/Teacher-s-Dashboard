import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LessonProgress from '../components/LessonProgress';
import QuizResults from '../components/QuizResults';

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        // First fetch the student's basic info
        const studentsResponse = await axios.get('/data/students.json');
        const student = studentsResponse.data.students.find(s => s.id === parseInt(id));
        
        if (!student) {
          throw new Error('Student not found');
        }

        // In a real app, you would fetch lesson and quiz data separately
        // For this example, we'll mock it based on the student ID
        const mockLessonData = [
          { id: 1, title: 'Introduction to Algebra', completed: true, progress: 100 },
          { id: 2, title: 'Linear Equations', completed: false, progress: 65 },
          { id: 3, title: 'Quadratic Equations', completed: false, progress: 20 },
        ];

        const mockQuizData = [
          { id: 1, name: 'Algebra Basics', date: 'Feb 10, 2023', score: 85, total: 100, passed: true },
          { id: 2, name: 'Linear Equations Quiz', date: 'Mar 5, 2023', score: 72, total: 100, passed: true },
          { id: 3, name: 'Midterm Exam', date: 'Apr 15, 2023', score: 58, total: 100, passed: false },
        ];

        setStudentData({
          ...student,
          email: `${student.name.replace(' ', '.').toLowerCase()}@school.edu`,
          status: 'active', // Default status
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          lessons: mockLessonData,
          quizzes: mockQuizData
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <p>Loading student data...</p>
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
              <p>Error loading student data: {error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <main className="p-6">
            <div className="flex items-center justify-center h-64">
              <p>Student not found</p>
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
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{studentData.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-gray-600">{studentData.email}</span>
              <span className={`px-2 py-1 text-xs rounded-full ${
                studentData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {studentData.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
              <h3 className="font-medium text-gray-900 mb-4">Student Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Join Date</p>
                  <p className="text-gray-900">{studentData.joinDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{studentData.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="text-gray-900 capitalize">{studentData.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="text-gray-900">{studentData.class}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <LessonProgress lessons={studentData.lessons} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quiz Results</h3>
            <QuizResults quizzes={studentData.quizzes} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDetail;