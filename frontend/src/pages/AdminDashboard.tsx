import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

type DashboardStats = {
  totalUsers: number
  totalPdfs: number
  totalViews: number
  recentAccessLogs: {
    _id: string
    user: { name: string; email: string }
    pdf: { title: string }
    ipAddress: string
    device: string
    accessedAt: string
  }[]
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${API_URL}/api/tracking/dashboard`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Admin Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor access and manage protected PDFs.</p>
        </div>
        <Link
          to="/admin/upload"
          className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primaryDark transition"
        >
          Upload PDF
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 shadow-lg">
          <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Total Users</div>
          <div className="text-2xl font-semibold">{stats?.totalUsers ?? '—'}</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total PDFs</div>
          <div className="text-2xl font-semibold">{stats?.totalPdfs ?? '—'}</div>
        </div>
        <div className="rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
          <div className="text-xs uppercase tracking-wide text-gray-400 mb-1">Total Views</div>
          <div className="text-2xl font-semibold">{stats?.totalViews ?? '—'}</div>
        </div>
      </div>

      <div className="rounded-xl bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
        <h2 className="text-sm font-semibold mb-3">Recent Access Logs</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4">User</th>
                <th className="py-2 pr-4">PDF</th>
                <th className="py-2 pr-4">IP</th>
                <th className="py-2 pr-4">Device</th>
                <th className="py-2 pr-4">Accessed At</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentAccessLogs?.length ? (
                stats.recentAccessLogs.map((log) => (
                  <tr key={log._id} className="border-b border-gray-100 dark:border-gray-800/60">
                    <td className="py-2 pr-4">
                      <div className="font-medium">{log.user?.name}</div>
                      <div className="text-[11px] text-gray-500">{log.user?.email}</div>
                    </td>
                    <td className="py-2 pr-4 text-sm">{log.pdf?.title}</td>
                    <td className="py-2 pr-4 text-xs">{log.ipAddress}</td>
                    <td className="py-2 pr-4 text-xs max-w-xs truncate">{log.device}</td>
                    <td className="py-2 pr-4 text-xs">
                      {new Date(log.accessedAt).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No access logs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

