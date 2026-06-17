import { useState } from 'react'
import { ChevronDown, ChevronUp, UserCheck, X, CalendarPlus, FileText } from 'lucide-react'
import { usePositionStore } from '@/stores/usePositionStore'
import { useApplicationStore } from '@/stores/useApplicationStore'
import { useInterviewStore } from '@/stores/useInterviewStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

const TABS: { key: ApplicationStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待筛选' },
  { key: 'interview', label: '进入面试' },
  { key: 'rejected', label: '已拒绝' },
  { key: 'offered', label: '已录用' },
]

export default function Applications() {
  const { user } = useAuthStore()
  const getPositionsByCompany = usePositionStore((s) => s.getPositionsByCompany)
  const getApplicationsByCompany = useApplicationStore((s) => s.getApplicationsByCompany)
  const updateApplicationStatus = useApplicationStore((s) => s.updateApplicationStatus)
  const addInterview = useInterviewStore((s) => s.addInterview)

  const companyId = user?.companyId ?? 'company-1'
  const positions = getPositionsByCompany(companyId)
  const positionIds = positions.map((p) => p.id)
  const applications = getApplicationsByCompany(positionIds)

  const [tab, setTab] = useState<ApplicationStatus | 'all'>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)
  const [interviewDate, setInterviewDate] = useState('')
  const [interviewTime, setInterviewTime] = useState('')
  const [interviewLocation, setInterviewLocation] = useState('')

  const filtered = tab === 'all' ? applications : applications.filter((a) => a.status === tab)

  const toggleExpand = (id: string) => setExpandedId(expandedId === id ? null : id)

  const handleInterview = (appId: string) => {
    setSelectedApp(appId)
    setInterviewDate('')
    setInterviewTime('')
    setInterviewLocation('')
    setModalOpen(true)
  }

  const submitInterview = () => {
    if (!selectedApp || !interviewDate || !interviewTime || !interviewLocation) return
    const app = applications.find((a) => a.id === selectedApp)
    if (!app) return
    const pos = positions.find((p) => p.id === app.positionId)
    addInterview({
      applicationId: app.id,
      positionId: app.positionId,
      studentId: app.studentId,
      studentName: app.studentName,
      companyName: pos?.companyName ?? '',
      positionTitle: pos?.title ?? app.positionTitle,
      interviewDate,
      interviewTime,
      location: interviewLocation,
      status: 'pending',
    })
    setModalOpen(false)
    setSelectedApp(null)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        申请管理
      </h1>

      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === t.key ? 'bg-teal-700 text-white' : 'text-slate-500 hover:bg-slate-100')}>
            {t.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty icon={<FileText className="h-12 w-12" />} title="暂无申请" description="还没有收到学生申请" />
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const expanded = expandedId === app.id
            return (
              <div key={app.id} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                <button onClick={() => toggleExpand(app.id)}
                  className="flex w-full items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium text-slate-900">{app.studentName}</p>
                      <p className="text-sm text-slate-500">{app.studentMajor} · {app.positionTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} label={APPLICATION_STATUSES[app.status]} />
                    <span className="text-xs text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>{app.createdAt}</span>
                    {expanded ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </div>
                </button>
                {expanded && (
                  <div className="border-t border-slate-100 px-5 py-4">
                    <p className="mb-4 text-sm text-slate-600 leading-relaxed">{app.selfIntroduction}</p>
                    <div className="flex items-center gap-2">
                      {app.status === 'pending' && (
                        <>
                          <button onClick={() => updateApplicationStatus(app.id, 'interview')}
                            className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                            <UserCheck className="h-4 w-4" /> 进入面试
                          </button>
                          <button onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                            <X className="h-4 w-4" /> 拒绝
                          </button>
                        </>
                      )}
                      {app.status === 'interview' && (
                        <button onClick={() => handleInterview(app.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors">
                          <CalendarPlus className="h-4 w-4" /> 安排面试
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="安排面试">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">面试日期</label>
            <input type="date" value={interviewDate} onChange={(e) => setInterviewDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">面试时间</label>
            <input type="time" value={interviewTime} onChange={(e) => setInterviewTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">面试地点</label>
            <input value={interviewLocation} onChange={(e) => setInterviewLocation(e.target.value)} placeholder="如：3号楼201会议室"
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
          </div>
          <button onClick={submitInterview} disabled={!interviewDate || !interviewTime || !interviewLocation}
            className={cn('w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              interviewDate && interviewTime && interviewLocation
                ? 'bg-teal-700 text-white hover:bg-teal-800'
                : 'cursor-not-allowed bg-slate-200 text-slate-400')}>
            确认安排
          </button>
        </div>
      </Modal>
    </div>
  )
}
