import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from './components/register'
import Login from "./components/Login";
import Home from "./components/Home";
import AdminDashboard from "./components/AdminDashboard";
import StudentDashboard from "./components/StudentDashboard";
import DashVerifyRequist from "./components/DashVerifyRequist";
import Courses from './components/Courses'
import Lesson from './components/Lesson'
import StudentCours from "./components/StudentCours";
import StudentList from "./components/StudentList";
import CoursPage from '../src/Pages/Admin/CoursPgage';
import AdminCreateQuiz from "./components/AdminCreateQuiz";
import CompletedCours from "./components/CompletedCours";
import Verify from './components/Verify';
import LessonPage from "./components/LessonPage";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/home' element={<Home />} />
        <Route path='/verify' element={<Verify />} />


        {/* Protected admin routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/DashVerifyRequist" element={
          <ProtectedRoute requiredRole="admin">
            <DashVerifyRequist />
          </ProtectedRoute>
        } />

        <Route path="/admin/sidebar" element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/courses" element={
          <ProtectedRoute requiredRole="admin">
            <Courses />
          </ProtectedRoute>
        } />

        <Route path="/admin/students" element={
          <ProtectedRoute requiredRole="admin">
            <StudentList />
          </ProtectedRoute>
        } />

        <Route path="/admin/courses/:courseId/lessons" element={
          <ProtectedRoute requiredRole="admin">
            <Lesson />
          </ProtectedRoute>
        } />

        <Route path="/admin/courses/:courseId/lessons/:lessonId/manage-quiz" element={
          <ProtectedRoute requiredRole="admin">
            <AdminCreateQuiz />
          </ProtectedRoute>
        } />


        {/* Student routes */}
        <Route path="/student/dashboard" element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/student/cours" element={
          <ProtectedRoute requiredRole="student">
            <StudentCours />
          </ProtectedRoute>
        } />

        <Route path="/admin/courses/:courseId" element={
          <ProtectedRoute requiredRole="admin">
            <CoursPage />
          </ProtectedRoute>
        } />

        <Route path="/student/cours/:courseId/lessons" element={
          <ProtectedRoute requiredRole="student">
            <LessonPage />
          </ProtectedRoute>
        } />

        <Route path="/student/cours/:courseId/completed" element={
          <ProtectedRoute requiredRole="student">
            <CompletedCours />
          </ProtectedRoute>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default App