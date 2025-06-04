import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import LessonProgress from '../components/LessonProgress';
import QuizResults from '../components/QuizResults';

const StudentDetail = () => {
  const { id } = useParams();
  const [studentData, setStudentData] = useState({
    name: '',
    email: '',
    status: 'active',
    joinDate: '',
    lessons: [],
    quizzes: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const [studentsResponse, coursesResponse] = await Promise.all([
          axios.get('http://localhost:3001/students'),
          axios.get('http://localhost:3001/courses')
        ]);

        const students = studentsResponse.data;
        const courses = coursesResponse.data;

        const student = students.find(s => s.id === id);

        if (!student) {
          throw new Error('Student not found');
        }

        const lessons = [];
        const quizzes = [];

        courses.forEach(course => {
          course.units?.forEach(unit => {
            unit.lessons?.forEach(lesson => {
              const isCompleted = lesson.completedBy?.includes(parseInt(id));
              if (lesson.type !== 'quiz') {
                lessons.push({
                  id: lesson.id,
                  title: lesson.title,
                  completed: isCompleted || false,
                  progress: isCompleted ? 100 : 0
                });
              } else if (lesson.attempts) {
                const quizAttempt = lesson.attempts.find(a => a.studentId === parseInt(id));
                if (quizAttempt) {
                  quizAttempt.attempts.forEach(attempt => {
                    quizzes.push({
                      name: lesson.title,
                      date: attempt.date,
                      score: attempt.score,
                      total: attempt.outOf,
                      passed: attempt.score / attempt.outOf >= 0.6
                    });
                  });
                }
              }
            });

            unit.quizzes?.forEach(quiz => {
              const quizAttempt = quiz.attempts?.find(a => a.studentId === parseInt(id));
              if (quizAttempt) {
                quizAttempt.attempts.forEach(attempt => {
                  quizzes.push({
                    name: quiz.title,
                    date: attempt.date,
                    score: attempt.score,
                    total: attempt.outOf,
                    passed: attempt.score / attempt.outOf >= 0.6
                  });
                });
              }
            });
          });
        });

        setStudentData({
          ...student,
          email: `${student.name.replace(/\s+/g, '.').toLowerCase()}@school.edu`,
          status: 'active',
          joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          lessons: lessons || [],
          quizzes: quizzes || []
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

  if (!studentData.name) {
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

  // Format quizzes data for the QuizResults component
  const quizzesDataForResults = [{
    studentId: id,
    studentName: studentData.name,
    quizzes: studentData.quizzes
  }];

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
              <span className={`px-2 py-1 text-xs rounded-full ${studentData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
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
                  <p className="text-gray-900">{studentData.class || 'N/A'}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
              <LessonProgress lessons={studentData.lessons} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-medium text-gray-900 mb-4">Quiz Results</h3>
            <QuizResults quizzesData={quizzesDataForResults} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDetail;