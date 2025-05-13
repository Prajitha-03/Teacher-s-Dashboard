import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import QuizResults from '../components/QuizResults';

const Quizzes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [allQuizzes, setAllQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const studentsResponse = await axios.get('/data/students.json');
        const mockQuizzes = studentsResponse.data.students.map(student => {
          const quizTemplates = [
            { name: 'Algebra Basics', date: 'Feb 10, 2023', total: 100 },
            { name: 'Linear Equations', date: 'Mar 5, 2023', total: 100 },
            { name: 'Midterm Exam', date: 'Apr 15, 2023', total: 100 }
          ];
          
          const quizzes = quizTemplates.map((quiz, index) => {
            const score = Math.floor(Math.random() * 40) + 60; // Random score between 60-100
            return {
              id: index + 1,
              name: quiz.name,
              date: quiz.date,
              score: score,
              total: quiz.total,
              passed: score >= 70
            };
          });

          return {
            studentId: student.id,
            studentName: student.name,
            quizzes: quizzes
          };
        });

        setAllQuizzes(mockQuizzes);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizData();
  }, []);

  const filteredQuizzes = allQuizzes
    .map(student => ({
      ...student,
      quizzes: student.quizzes.filter(quiz => {
        const matchesSearch = quiz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            student.studentName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
                           (statusFilter === 'passed' && quiz.passed) ||
                           (statusFilter === 'failed' && !quiz.passed);
        return matchesSearch && matchesStatus;
      })
    }))
    .filter(student => student.quizzes.length > 0);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Quiz Results" />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <p>Loading quiz data...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Quiz Results" />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <div className="text-center text-red-500">
              <p>Error loading quiz data: {error}</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Quiz Results" />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">All Quiz Results</h1>
            </div>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                    Search Quizzes
                  </label>
                  <input
                    type="text"
                    id="search"
                    placeholder="Search by quiz name or student..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="status"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Results</option>
                    <option value="passed">Passed Only</option>
                    <option value="failed">Failed Only</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredQuizzes.length > 0 ? (
              <div className="space-y-8">
                {filteredQuizzes.map(student => (
                  <div key={student.studentId} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                      <h3 className="text-lg font-medium text-gray-900">
                        {student.studentName}
                        <span className="ml-2 text-sm font-normal text-gray-500">
                          (Student ID: {student.studentId})
                        </span>
                      </h3>
                    </div>
                    <QuizResults quizzes={student.quizzes} editable={true} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No quiz results found matching your criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Quizzes;