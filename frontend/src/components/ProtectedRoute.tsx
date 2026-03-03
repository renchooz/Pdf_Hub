import React, { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({ children, role }: { children: ReactNode; role?: 'admin' | 'student' }) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="flex justify-center items-center py-10 text-gray-500">Loading...</div>
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
  }

  return <>{children}</>
}

