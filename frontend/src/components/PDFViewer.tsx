import React, { useEffect, useRef } from 'react'

type Props = {
  pdfUrl: string
}

export const PDFViewer = ({ pdfUrl }: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && ['s', 'p', 'u'].includes(e.key.toLowerCase())) ||
        e.key === 'PrintScreen' ||
        e.key === 'F12'
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    const contextHandler = (e: MouseEvent) => {
      e.preventDefault()
    }

    document.addEventListener('keydown', handler)
    document.addEventListener('contextmenu', contextHandler)

    return () => {
      document.removeEventListener('keydown', handler)
      document.removeEventListener('contextmenu', contextHandler)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,black_90%)] opacity-5" />
      <iframe
        src={pdfUrl}
        title="Secure PDF Viewer"
        className="w-full h-[70vh]"
      />
      <div className="absolute top-2 right-2 text-[10px] bg-black/60 text-white px-2 py-1 rounded-full">
        Protected • Printing / Download discouraged
      </div>
    </div>
  )
}

