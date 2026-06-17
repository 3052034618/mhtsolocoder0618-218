import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import { usePositionStore } from '@/stores/usePositionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { MAJORS, CITIES, DURATIONS } from '@/types'
import { cn } from '@/lib/utils'

const STEPS = ['基本信息', '详细描述', '要求设置']

export default function PostPosition() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const addPosition = usePositionStore((s) => s.addPosition)
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [duration, setDuration] = useState('')
  const [salary, setSalary] = useState('')
  const [description, setDescription] = useState('')
  const [requirements, setRequirements] = useState<string[]>([''])
  const [majorRequired, setMajorRequired] = useState<string[]>([])

  const companyId = user?.companyId ?? 'company-1'
  const companyName = user?.companyName ?? ''
  const companyLogo = ''

  const canNext = () => {
    if (step === 0) return title && department && city && duration && salary
    if (step === 1) return description.trim().length > 0
    return true
  }

  const handleAddReq = () => setRequirements([...requirements, ''])
  const handleRemoveReq = (i: number) => setRequirements(requirements.filter((_, idx) => idx !== i))
  const handleChangeReq = (i: number, v: string) => {
    const next = [...requirements]
    next[i] = v
    setRequirements(next)
  }
  const toggleMajor = (m: string) => {
    setMajorRequired((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m])
  }

  const handleSubmit = () => {
    addPosition({
      companyId,
      companyName,
      companyLogo,
      title,
      department,
      description,
      duration,
      salary,
      requirements: requirements.filter((r) => r.trim()),
      majorRequired,
      city,
      status: 'pending_review',
    })
    navigate('/company/positions')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        发布职位
      </h1>

      <div className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={i} className="flex flex-1 items-center gap-2">
            <div className={cn(
              'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium',
              i <= step ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-500'
            )} style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {i + 1}
            </div>
            <span className={cn('text-sm', i <= step ? 'text-teal-700 font-medium' : 'text-slate-400')}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={cn('h-px flex-1', i < step ? 'bg-teal-700' : 'bg-slate-200')} />}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">职位名称</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="如：前端开发实习生"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">部门</label>
              <input value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="如：技术部"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">城市</label>
                <select value={city} onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700">
                  <option value="">请选择</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">实习时长</label>
                <select value={duration} onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700">
                  <option value="">请选择</option>
                  {DURATIONS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">薪资</label>
              <input value={salary} onChange={(e) => setSalary(e.target.value)} placeholder="如：150-200/天"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">职位描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              rows={10} placeholder="请详细描述岗位职责和工作内容..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">任职要求</label>
                <button type="button" onClick={handleAddReq}
                  className="inline-flex items-center gap-1 text-sm text-teal-700 hover:text-teal-800">
                  <Plus className="h-4 w-4" /> 添加
                </button>
              </div>
              {requirements.map((req, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <input value={req} onChange={(e) => handleChangeReq(i, e.target.value)}
                    placeholder={`要求 ${i + 1}`}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
                  {requirements.length > 1 && (
                    <button type="button" onClick={() => handleRemoveReq(i)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">专业要求（多选）</label>
              <div className="grid grid-cols-3 gap-2">
                {MAJORS.map((m) => (
                  <label key={m} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer"
                    style={{ borderColor: majorRequired.includes(m) ? '#0f766e' : '#e2e8f0', backgroundColor: majorRequired.includes(m) ? '#f0fdfa' : undefined }}>
                    <input type="checkbox" checked={majorRequired.includes(m)} onChange={() => toggleMajor(m)}
                      className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-700" />
                    <span className={cn(majorRequired.includes(m) ? 'text-teal-700' : 'text-slate-600')}>{m}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button type="button" disabled={step === 0} onClick={() => setStep(step - 1)}
          className={cn('inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
            step === 0 ? 'cursor-not-allowed text-slate-300' : 'text-slate-600 hover:bg-slate-100')}>
          <ChevronLeft className="h-4 w-4" /> 上一步
        </button>
        {step < STEPS.length - 1 ? (
          <button type="button" disabled={!canNext()} onClick={() => setStep(step + 1)}
            className={cn('inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              canNext() ? 'bg-teal-700 text-white hover:bg-teal-800' : 'cursor-not-allowed bg-slate-200 text-slate-400')}>
            下一步 <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button type="button" onClick={handleSubmit}
            className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors">
            <Briefcase className="h-4 w-4" /> 提交审核
          </button>
        )}
      </div>
    </div>
  )
}
