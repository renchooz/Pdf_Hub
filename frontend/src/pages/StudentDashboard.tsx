import React, { useEffect, useState } from 'react'
import { PDFViewer } from '../components/PDFViewer'

type Pdf = {
  _id: string
  title: string
  createdAt: string
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const StudentDashboard = () => {
  const [pdfs, setPdfs] = useState<Pdf[]>([])
  const [selectedPdf, setSelectedPdf] = useState<Pdf | null>(null)

  useEffect(() => {
    const fetchPdfs = async () => {
      const res = await fetch(`${API_URL}/api/pdfs`, {
        credentials: 'include',
      })
      if (res.ok) {
        const data = await res.json()
        setPdfs(data)
        if (data.length) setSelectedPdf(data[0])
      }
    }
    fetchPdfs()
  }, [])

  const pdfUrl = selectedPdf ? `${API_URL}/api/pdfs/${selectedPdf._id}/stream` : ''

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-6">
      <aside className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-4 space-y-3">
        <h2 className="text-sm font-semibold mb-1">Available PDFs</h2>
        <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
          {pdfs.length ? (
            pdfs.map((pdf) => (
              <button
                key={pdf._id}
                onClick={() => setSelectedPdf(pdf)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm border ${
                  selectedPdf?._id === pdf._id
                    ? 'bg-primary text-white border-primary'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="font-medium truncate">{pdf.title}</div>
                <div className="text-[11px] opacity-70">
                  {new Date(pdf.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                </div>
              </button>
            ))
          ) : (
            <div className="text-xs text-gray-500">No PDFs assigned yet.</div>
          )}
        </div>
      </aside>
      <section className="space-y-3">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Student Library – PDF Hub</h1>
          <p className="text-sm text-gray-500">
            PDFs open in a protected in-browser viewer. Printing, downloading, and selection are discouraged at the
            UI level, but screenshots are still technically possible.
          </p>
        </div>
        {selectedPdf && pdfUrl ? (
          <PDFViewer pdfUrl={pdfUrl} />
        ) : (
          <div className="h-[70vh] flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-800 rounded-xl text-gray-500 text-sm">
            Select a PDF on the left to view it here.
          </div>
        )}
      </section>
    </div>
  )
}

