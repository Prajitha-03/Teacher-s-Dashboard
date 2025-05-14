import { useState } from 'react';

const QuizResults = ({ quizzesData }) => {
  const allQuizzes = [];
  const allStudents = [];
  const resultsMap = {};

  quizzesData.forEach(studentData => {
    allStudents.push({
      id: studentData.studentId,
      name: studentData.studentName
    });

    studentData.quizzes.forEach(quiz => {
      const quizKey = `${quiz.name}-${quiz.date}`;

      if (!allQuizzes.some(q => q.key === quizKey)) {
        allQuizzes.push({
          key: quizKey,
          name: quiz.name,
          date: quiz.date,
          total: quiz.total
        });
      }

      if (!resultsMap[quizKey]) {
        resultsMap[quizKey] = {};
      }

      resultsMap[quizKey][studentData.studentId] = {
        score: quiz.score,
        total: quiz.total
      };
    });
  });

  allQuizzes.sort((a, b) => new Date(b.date) - new Date(a.date));

  const generateCSV = () => {
    const header = ['Quiz Name', 'Date', 'Total Marks', ...allStudents.map(s => s.name)];

    const rows = allQuizzes.map(quiz => {
      const row = [quiz.name, quiz.date, quiz.total];
      allStudents.forEach(student => {
        const result = resultsMap[quiz.key]?.[student.id];
        row.push(result ? result.score : 'NO ATTEMPT');
      });
      return row;
    });

    const csvContent = [header, ...rows].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'quiz_results.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <button
          onClick={generateCSV}
          className="bg-gray-200 text-gray-500 py-1 px-4 rounded mb-4 ml-4 mt-4"
        >
          Download .csv
        </button>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quiz
              </th>
              {allStudents.map(student => (
                <th
                  key={student.id}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {student.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allQuizzes.map(quiz => (
              <tr key={quiz.key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div>
                    <p className="font-semibold">{quiz.name}</p>
                    <p className="text-xs text-gray-500">{quiz.date}</p>
                    <p className="text-xs text-gray-500">Total: {quiz.total}</p>
                  </div>
                </td>
                {allStudents.map(student => {
                  const result = resultsMap[quiz.key]?.[student.id];
                  let bgColor = 'bg-gray-100 text-gray-500';
                  if (result) {
                    const scoreRatio = result.score / result.total;
                    if (scoreRatio >= 0.8) bgColor = 'bg-green-100 text-green-800';
                    else if (scoreRatio >= 0.5) bgColor = 'bg-yellow-100 text-yellow-800';
                    else bgColor = 'bg-red-100 text-red-800';
                  }
                  return (
                    <td
                      key={`${quiz.key}-${student.id}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {result ? (
                        <div className={`flex flex-col items-start p-2 w-10 rounded ${bgColor}`}>
                          <span className="font-medium">{result.score}/{result.total}</span>
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded p-4 h-full w-10 bg-gray-50"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizResults;
