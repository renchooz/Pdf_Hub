import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { AdminDashboard } from './pages/AdminDashboard'
import { UploadPDF } from './pages/UploadPDF'
import { StudentDashboard } from './pages/StudentDashboard'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-backgroundLight dark:bg-backgroundDark text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              <ProtectedRoute role="admin">
                <UploadPDF />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'} replace />}
          />
        </Routes>
      </main>
    </div>
  )
}

export default App

