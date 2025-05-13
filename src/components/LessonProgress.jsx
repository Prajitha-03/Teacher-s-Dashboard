import { useState } from 'react';

const LessonProgress = ({ lessons, editable = false }) => {
  const [editing, setEditing] = useState(null);
  const [progressValue, setProgressValue] = useState(0);

  const handleEditStart = (lesson) => {
    setEditing(lesson.id);
    setProgressValue(lesson.progress);
  };

  const handleProgressChange = (e) => {
    setProgressValue(e.target.value);
  };

  const handleSave = (lessonId) => {
    setEditing(null);
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Lesson Progress
        </h3>
      </div>
      <div className="px-4 py-5 sm:p-6">
        <div className="space-y-6">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="space-y-2">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium text-gray-700">{lesson.title}</h4>
                {editable && !editing && (
                  <button
                    onClick={() => handleEditStart(lesson)}
                    className="text-xs text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing === lesson.id ? (
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progressValue}
                    onChange={handleProgressChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 w-12">{progressValue}%</span>
                  <button
                    onClick={() => handleSave(lesson.id)}
                    className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${lesson.completed ? 'bg-green-500' : 'bg-yellow-500'
                      }`}
                    style={{ width: `${lesson.progress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-between text-xs text-gray-500">
                <span>{lesson.completed ? 'Completed' : 'In Progress'}</span>
                <span>{lesson.progress}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonProgress;