import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:3001/courses/${courseId}`)
      .then(res => setCourse(res.data))
      .catch(err => console.error("Error loading course:", err));

    axios.get('http://localhost:3001/students')
      .then(res => setStudents(res.data))
      .catch(err => console.error("Error loading students:", err));
  }, [courseId]);

  const getStudentName = (id) => {
    const student = students.find(s => s.id === id || s.id === parseInt(id));
    return student ? student.name : `Student ${id}`;
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-block mb-4 text-indigo-600 hover:underline">
          ← Back to Dashboard
        </Link>

        {course ? (
          <>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">{course.title}</h2>

            {course.units.map(unit => (
              <div key={unit.id} className="bg-white shadow-md rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Unit: {unit.title}</h3>

                {/* Lessons */}
                {unit.lessons.length > 0 && (
                  <>
                    <h4 className="text-lg font-medium text-gray-800 mb-2">Lessons:</h4>
                    {unit.lessons.map(lesson => (
                      <div key={lesson.id} className="mb-4 pl-4 border-l-4 border-indigo-300">
                        <p className="text-gray-700 font-semibold">{lesson.title} <span className="text-sm text-gray-500">({lesson.type})</span></p>

                        {lesson.completedBy && lesson.completedBy.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-gray-600 mt-1">
                            {lesson.completedBy.map(id => (
                              <li key={id}>{getStudentName(id)} completed it</li>
                            ))}
                          </ul>
                        )}

                        {lesson.attempts && lesson.attempts.length > 0 && (
                          <div className="mt-2 text-sm">
                            <p className="font-medium text-gray-700">Attempts:</p>
                            {lesson.attempts.map(attempt => (
                              <div key={attempt.studentId} className="ml-4 mb-2">
                                <strong>{getStudentName(attempt.studentId)}</strong>
                                <ul className="list-disc list-inside text-gray-600">
                                  {attempt.attempts.map((a, idx) => (
                                    <li key={idx}>Score: {a.score}/{a.outOf} on {a.date}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}

                {/* Quizzes */}
                {unit.quizzes.length > 0 && (
                  <>
                    <h4 className="text-lg font-medium text-gray-800 mt-4 mb-2">Quizzes:</h4>
                    {unit.quizzes.map(quiz => (
                      <div key={quiz.id} className="mb-4 pl-4 border-l-4 border-green-300">
                        <p className="text-gray-700 font-semibold">{quiz.title} <span className="text-sm text-gray-500">({quiz.type})</span></p>

                        {quiz.attempts && quiz.attempts.length > 0 && (
                          <div className="mt-2 text-sm">
                            {quiz.attempts.map(attempt => (
                              <div key={attempt.studentId} className="ml-4 mb-2">
                                <strong>{getStudentName(attempt.studentId)}</strong>
                                <ul className="list-disc list-inside text-gray-600">
                                  {attempt.attempts.map((a, idx) => (
                                    <li key={idx}>Score: {a.score}/{a.outOf} on {a.date}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-600">Loading course...</p>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
