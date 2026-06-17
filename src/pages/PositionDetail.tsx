import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Upload, Building2, MapPin, Clock, Banknote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePositionStore } from '@/stores/usePositionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { useApplicationStore } from '@/stores/useApplicationStore'
import { useReviewStore } from '@/stores/useReviewStore'
import Modal from '@/components/Modal'

const LOGO_COLORS = [
  'bg-teal-600', 'bg-amber-600', 'bg-blue-600',
  'bg-purple-600', 'bg-rose-600', 'bg-emerald-600',
]

function getLogoColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length]
}

export default function PositionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const getPositionById = usePositionStore((s) => s.getPositionById)
  const addApplication = useApplicationStore((s) => s.addApplication)
  const getApplicationsByStudent = useApplicationStore((s) => s.getApplicationsByStudent)
  const getReviewByCompanyId = useReviewStore((s) => s.getReviewByCompanyId)

  const position = id ? getPositionById(id) : undefined
  const companyReview = position ? getReviewByCompanyId(position.companyId) : undefined

  const isStudent = user?.role === 'student'
  const existingApps = isStudent ? getApplicationsByStudent(user.id) : []
  const alreadyApplied = id ? existingApps.some((a) => a.positionId === id) : false

  const [modalOpen, setModalOpen] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [selfIntro, setSelfIntro] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!position) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">职位不存在</p>
      </div>
    )
  }

  const handleSubmit = () => {
    if (!user || !isStudent) return
    addApplication({
      positionId: position.id,
      positionTitle: position.title,
      companyName: position.companyName,
      studentId: user.id,
      studentName: user.name,
      studentMajor: user.major || '',
      resumeUrl: resumeFile ? resumeFile.name : '',
      selfIntroduction: selfIntro,
    })
    setSubmitted(true)
    setModalOpen(false)
    setResumeFile(null)
    setSelfIntro('')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) setResumeFile(file)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-1 text-sm text-slate-500 hover:text-teal-700"
        >
          <ArrowLeft className="h-4 w-4" />
          返回
        </button>

        <div className="mb-6 flex items-start gap-4">
          <div
            className={cn(
              'flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-lg font-bold text-white',
              getLogoColor(position.companyName)
            )}
          >
            {position.companyLogo}
          </div>
          <div>
            <h1
              className="text-2xl font-bold text-slate-900"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              {position.title}
            </h1>
            <p className="mt-1 text-slate-500">{position.department}</p>
            <div className="mt-2 flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-teal-700" />
              <span className="text-sm font-medium text-teal-700">{position.companyName}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-6">
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                <MapPin className="h-4 w-4 text-slate-400" />
                {position.city}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                <Clock className="h-4 w-4 text-slate-400" />
                {position.duration}
              </span>
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
                <Banknote className="h-4 w-4 text-amber-500" />
                {position.salary}
              </span>
            </div>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">职位描述</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {position.description}
              </p>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">岗位要求</h2>
              <ul className="space-y-2">
                {position.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">所需专业</h2>
              <div className="flex flex-wrap gap-2">
                {position.majorRequired.map((major) => (
                  <span
                    key={major}
                    className="rounded-full bg-teal-50 px-3 py-1 text-sm text-teal-700"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </section>

            {isStudent && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                {alreadyApplied || submitted ? (
                  <button
                    disabled
                    className="w-full rounded-lg bg-slate-100 py-3 text-sm font-medium text-slate-400"
                  >
                    已投递
                  </button>
                ) : (
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full rounded-lg bg-teal-700 py-3 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                  >
                    投递简历
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="w-full shrink-0 lg:w-72">
            <div className="sticky top-24 rounded-xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-16 w-16 items-center justify-center rounded-xl text-xl font-bold text-white',
                    getLogoColor(position.companyName)
                  )}
                >
                  {position.companyLogo}
                </div>
                <h3 className="mt-3 font-semibold text-slate-900">{position.companyName}</h3>
              </div>
              {companyReview && (
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">行业</span>
                    <span className="font-medium text-slate-700">{companyReview.industry}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">规模</span>
                    <span className="font-medium text-slate-700">{companyReview.companyScale}</span>
                  </div>
                </div>
              )}
              {companyReview?.companyIntro && (
                <p className="mt-3 border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
                  {companyReview.companyIntro}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {isStudent && (
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="投递简历"
          size="lg"
        >
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">上传简历</p>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('resume-input')?.click()}
                className={cn(
                  'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                  resumeFile
                    ? 'border-teal-300 bg-teal-50'
                    : 'border-slate-200 bg-slate-50 hover:border-teal-400 hover:bg-teal-50/50'
                )}
              >
                <Upload className="mb-2 h-8 w-8 text-slate-400" />
                <p className="text-sm text-slate-500">
                  {resumeFile ? resumeFile.name : '点击或拖拽上传简历文件'}
                </p>
                <p className="mt-1 text-xs text-slate-400">支持 PDF、DOC、DOCX 格式</p>
              </div>
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setResumeFile(file)
                }}
                className="hidden"
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700">自我介绍</p>
              <textarea
                value={selfIntro}
                onChange={(e) => setSelfIntro(e.target.value)}
                placeholder="简要介绍你的优势和对该职位的兴趣..."
                rows={4}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!resumeFile || !selfIntro.trim()}
              className={cn(
                'w-full rounded-lg py-2.5 text-sm font-medium transition-colors',
                resumeFile && selfIntro.trim()
                  ? 'bg-teal-700 text-white hover:bg-teal-800'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              )}
            >
              确认投递
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
