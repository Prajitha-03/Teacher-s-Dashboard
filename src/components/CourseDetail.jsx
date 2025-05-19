import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StudentCard from '../components/StudentCard';
import LessonProgress from '../components/LessonProgress';

const CourseDetail = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/data/LMS_Techers_Dashboard.json');
        const foundCourse = response.data.courses.find(c => c.id === courseId);
        
        if (!foundCourse) {
          throw new Error('Course not found');
        }

        setCourse(foundCourse);
        setStudents(response.data.students);

       
        const enrolledIds = new Set();
        foundCourse.units.forEach(unit => {
          unit.lessons.forEach(lesson => {
            lesson.completedBy.forEach(id => enrolledIds.add(id));
          });
          unit.quizzes.forEach(quiz => {
            quiz.attempts.forEach(attempt => enrolledIds.add(attempt.studentId));
          });
        });

        const enrolled = response.data.students
          .filter(student => enrolledIds.has(student.id))
          .map(student => ({
            ...student,
            email: `${student.name.replace(' ', '.').toLowerCase()}@school.edu`,
            status: 'active'
          }));

        setEnrolledStudents(enrolled);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <p>Loading course data...</p>
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
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center text-red-500">
            <p>Error: {error}</p>
          </main>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50 flex items-center justify-center">
            <p>Course not found</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
                <p className="text-gray-600">Course ID: {course.id}</p>
              </div>
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-900 mb-4">Course Information</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Total Units</p>
                    <p className="text-gray-900">{course.units.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Lessons</p>
                    <p className="text-gray-900">
                      {course.units.reduce((acc, unit) => acc + unit.lessons.length, 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Enrolled Students</p>
                    <p className="text-gray-900">{enrolledStudents.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6 mt-6">
                <h3 className="font-medium text-gray-900 mb-4">Enrolled Students</h3>
                <div className="space-y-3">
                  {enrolledStudents.map(student => (
                    <div 
                      key={student.id}
                      className={`p-3 rounded-md cursor-pointer hover:bg-gray-50 ${
                        selectedStudent?.id === student.id ? 'bg-indigo-50' : ''
                      }`}
                      onClick={() => setSelectedStudent(student)}
                    >
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              {selectedStudent ? (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium text-gray-900">
                      {selectedStudent.name}'s Progress
                    </h3>
                    <button 
                      onClick={() => setSelectedStudent(null)}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Back to all students
                    </button>
                  </div>

                  <div className="space-y-6">
                    {course.units.map(unit => (
                      <div key={unit.id} className="mb-6">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">{unit.title}</h4>
                        
                        {unit.lessons.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Lessons</h5>
                            <div className="space-y-2">
                              {unit.lessons.map(lesson => (
                                <div 
                                  key={lesson.id}
                                  className={`p-3 rounded-md ${
                                    lesson.completedBy.includes(selectedStudent.id) 
                                      ? 'bg-green-50 border border-green-100' 
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="flex justify-between">
                                    <p className="font-medium">{lesson.title}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${
                                      lesson.completedBy.includes(selectedStudent.id)
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {lesson.completedBy.includes(selectedStudent.id)
                                        ? 'Completed'
                                        : 'Not Started'}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-500 mt-1">{lesson.type}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {unit.quizzes.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Quizzes</h5>
                            <div className="space-y-2">
                              {unit.quizzes.map(quiz => {
                                const studentAttempts = quiz.attempts.find(
                                  a => a.studentId === selectedStudent.id
                                )?.attempts || [];
                                
                                return (
                                  <div key={quiz.id} className="p-3 rounded-md bg-blue-50 border border-blue-100">
                                    <div className="flex justify-between">
                                      <p className="font-medium">{quiz.title}</p>
                                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                        {studentAttempts.length > 0 ? 'Attempted' : 'Not Attempted'}
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{quiz.type}</p>
                                    
                                    {studentAttempts.length > 0 && (
                                      <div className="mt-2 space-y-2">
                                        {studentAttempts.map((attempt, idx) => (
                                          <div key={idx} className="text-sm">
                                            <p>Score: {attempt.score}/{attempt.outOf}</p>
                                            <p className="text-xs text-gray-500">Date: {attempt.date}</p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Course Units</h3>
                  <div className="space-y-6">
                    {course.units.map(unit => (
                      <div key={unit.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <h4 className="text-lg font-medium text-gray-900 mb-3">{unit.title}</h4>
                        
                        {unit.lessons.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Lessons</h5>
                            <div className="space-y-2">
                              {unit.lessons.map(lesson => (
                                <div key={lesson.id} className="p-3 rounded-md bg-gray-50">
                                  <p className="font-medium">{lesson.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {lesson.type} • Completed by {lesson.completedBy.length} students
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {unit.quizzes.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-500 mb-2">Quizzes</h5>
                            <div className="space-y-2">
                              {unit.quizzes.map(quiz => (
                                <div key={quiz.id} className="p-3 rounded-md bg-blue-50">
                                  <p className="font-medium">{quiz.title}</p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {quiz.type} • Attempted by {quiz.attempts.length} students
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;