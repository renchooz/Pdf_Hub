import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [dark, setDark] = useState(true)

  const toggleTheme = () => {
    setDark((prev) => !prev)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={user ? (user.role === 'admin' ? '/admin' : '/student') : '/login'}
          className="font-semibold text-lg"
        >
          <span className="text-primary">PDF HUB</span> by Raj Sharma
        </Link>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          {user && (
            <>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {user.name} ({user.role})
              </span>
              <button
                onClick={logout}
                className="px-3 py-1 rounded-md text-sm bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          )}
          {!user && location.pathname !== '/login' && (
            <Link
              to="/login"
              className="px-3 py-1 rounded-md text-sm bg-primary text-white hover:bg-primaryDark transition"
            >
              Login
            </Link>
          )}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-xs"
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  )
}

