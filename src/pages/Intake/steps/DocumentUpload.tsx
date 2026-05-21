import React, { useState, useCallback } from 'react'
import { Upload, FileText, Check, AlertCircle } from 'lucide-react'
import GlassCard from '../../../components/ui/GlassCard'
import PrimaryButton from '../../../components/ui/PrimaryButton'
import GhostButton from '../../../components/ui/GhostButton'
import ConfidenceIndicator from '../../../components/ui/ConfidenceIndicator'
import { mockExtractedValues } from '../../../data/mockRecommendations'
import { useExtractDoc } from '../../../hooks/useExtractDoc'

interface Props {
  formData: any
  updateField: (field: string, value: any) => void
}

export default function DocumentUpload({ formData, updateField }: Props) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [extracted, setExtracted] = useState(false)
  const [manualMode, setManualMode] = useState(false)
  const [extractedData, setExtractedData] = useState<any>(null)

  const extractDoc = useExtractDoc()

  const handleUpload = (file: File) => {
    setUploadedFile(file.name)
    setExtracting(true)
    extractDoc.mutate(file, {
      onSuccess: (data) => {
        setExtracting(false)
        setExtracted(true)
        setExtractedData(data?.extracted_values || data)
        updateField('documentsUploaded', true)
      },
      onError: (err) => {
        setExtracting(false)
        alert('Failed to extract document details.')
      }
    })
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }


  const statusColor = {
    normal: 'text-emerald-400',
    elevated: 'text-amber-400',
    high: 'text-red-400',
    low: 'text-amber-400',
  }

  const extractedEntries = Object.entries(extractedData || mockExtractedValues) as [string, { value: string; confidence: number; status: 'normal' | 'elevated' | 'high' | 'low' }][]

  const labelMap: Record<string, string> = {
    hba1c: 'HbA1c', glucose: 'Glucose', bloodPressure: 'Blood Pressure',
    cholesterol: 'Cholesterol', hdl: 'HDL', ldl: 'LDL',
    creatinine: 'Creatinine', haemoglobin: 'Haemoglobin',
  }

  return (
    <div className="animate-slide-up">
      <h2 className="text-[22px] font-medium text-white mb-2">Medical Documents</h2>
      <p className="text-[14px] text-white/40 mb-8">Upload lab reports for AI-powered extraction (optional)</p>

      {!uploadedFile && !manualMode && (
        <GlassCard className="p-8">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`
              border-2 border-dashed rounded-[var(--radius-lg)] p-12
              flex flex-col items-center justify-center gap-4
              transition-all duration-200 cursor-pointer
              ${isDragging ? 'border-white/30 bg-white/[0.04]' : 'border-white/10 hover:border-white/20'}
            `}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <Upload className="w-10 h-10 text-white/20" strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-[14px] text-white/60">Drag & drop your medical report</p>
              <p className="text-[12px] text-white/30 mt-1">PDF, JPG, or PNG — Max 10MB</p>
            </div>
          </div>

          <input
            id="file-input"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="mt-6 text-center">
            <button
              onClick={() => setManualMode(true)}
              className="text-[13px] text-white/30 hover:text-white/50 transition-colors underline underline-offset-2"
            >
              Skip — I'll enter values manually
            </button>
          </div>
        </GlassCard>
      )}

      {uploadedFile && extracting && (
        <GlassCard className="p-8 text-center">
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/[0.06] flex items-center justify-center">
            <FileText className="w-6 h-6 text-white/40 animate-pulse-soft" />
          </div>
          <p className="text-[14px] text-white/60 mb-2">Extracting health data from your report...</p>
          <p className="text-[12px] text-white/30">Using Claude AI for clinical document analysis</p>
          <div className="mt-6 w-48 h-1 mx-auto bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </GlassCard>
      )}

      {extracted && !manualMode && (
        <div className="space-y-5">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-emerald-400/10 flex items-center justify-center">
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-[14px] font-medium text-white">Values Extracted</p>
                <p className="text-[12px] text-white/40">{uploadedFile}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {extractedEntries.map(([key, data]) => (
                <div key={key} className="flex items-center justify-between px-4 py-3 rounded-[var(--radius-md)] bg-white/[0.03] border border-white/[0.06]">
                  <div>
                    <p className="text-[12px] text-white/40">{labelMap[key]}</p>
                    <p className={`text-[14px] font-medium ${statusColor[data.status]}`}>{data.value}</p>
                  </div>
                  <ConfidenceIndicator confidence={data.confidence} />
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="flex gap-3">
            <PrimaryButton onClick={() => {}} className="flex-1">
              <Check className="w-4 h-4" /> Confirm & Use
            </PrimaryButton>
            <GhostButton onClick={() => { setExtracted(false); setManualMode(true) }}>
              Enter Manually
            </GhostButton>
          </div>
        </div>
      )}

      {manualMode && (
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-5">
            <AlertCircle className="w-4 h-4 text-white/30" />
            <p className="text-[13px] text-white/50">Manual entry mode — skip if not available</p>
          </div>
          <p className="text-[12px] text-white/30">Manual entry fields will be available once connected to the backend. For now, proceeding with demo data.</p>
        </GlassCard>
      )}
    </div>
  )
}
