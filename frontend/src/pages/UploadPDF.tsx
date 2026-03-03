import React, { FormEvent, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const UploadPDF = () => {
  const [title, setTitle] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setMessage(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('studentEmail', studentEmail)

    const res = await fetch(`${API_URL}/api/pdfs/upload`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    const data = await res.json()
    if (!res.ok) {
      setMessage(data.message || 'Upload failed')
    } else {
      setMessage('Uploaded and watermarked successfully')
      setTitle('')
      setStudentEmail('')
      setFile(null)
    }
    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Upload Watermarked PDF</h1>
        <p className="text-sm text-gray-500">
          Each PDF is watermarked with the admin email and the selected student email across all pages.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-6 space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Student Email for Watermark</label>
          <input
            type="email"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">PDF File</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
            className="w-full text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-xs file:font-medium file:text-white hover:file:bg-primaryDark"
          />
        </div>
        {message && <div className="text-sm text-primary">{message}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-md bg-primary hover:bg-primaryDark text-white text-sm font-medium transition disabled:opacity-60"
        >
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
    </div>
  )
}

