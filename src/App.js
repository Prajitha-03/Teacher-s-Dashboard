import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import StudentDetail from './pages/StudentDetail';
import Quizzes from './pages/Quizzes';
import Create from './services/Create';
import Update from './services/Update';
import CourseDetail from './pages/CourseDetail';

function App() {
  return (
    <Router>
      <div className="flex-1 h-screen w-full bg-gray-100">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path='/create' element={<Create />} />
          <Route path="/students/update/:id" element={<Update />} />
          <Route path="/courses/:courseId" element={<CourseDetail />} />
          <Route path="/students" element={<Students />} />
          <Route path="/students/:id" element={<StudentDetail/>} />
          <Route path="/quizzes" element={<Quizzes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;