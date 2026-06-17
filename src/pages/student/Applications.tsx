import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FileText, Calendar, MapPin, BadgeCheck, X, ArrowRight } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useApplicationStore } from '@/stores/useApplicationStore'
import { useInterviewStore } from '@/stores/useInterviewStore'
import { useAgreementStore } from '@/stores/useAgreementStore'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { APPLICATION_STATUSES } from '@/types'
import type { ApplicationStatus, Application } from '@/types'
import { cn } from '@/lib/utils'

const statusTabs: { key: ApplicationStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待筛选' },
  { key: 'interview', label: '面试中' },
  { key: 'offered', label: '已录用' },
  { key: 'accepted', label: '已接受' },
  { key: 'rejected', label: '已拒绝' },
]

export default function Applications() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const getApplicationsByStudent = useApplicationStore((s) => s.getApplicationsByStudent)
  const getInterviewsByStudent = useInterviewStore((s) => s.getInterviewsByStudent)
  const updateApplicationStatus = useApplicationStore((s) => s.updateApplicationStatus)
  const agreements = useAgreementStore((s) => s.agreements)
  const addAgreement = useAgreementStore((s) => s.addAgreement)

  const createAgreementIfNeeded = (app: Application) => {
    const exists = agreements.some((a) => a.applicationId === app.id)
    if (exists) return
    const today = new Date()
    const start = new Date(today); start.setDate(today.getDate() + 7)
    const end = new Date(start); end.setMonth(start.getMonth() + 6)
    const startDate = start.toISOString().split('T')[0]
    const endDate = end.toISOString().split('T')[0]
    addAgreement({
      applicationId: app.id,
      positionId: app.positionId,
      positionTitle: app.positionTitle,
      studentId: app.studentId,
      studentName: app.studentName,
      companyId: 'company-1',
      companyName: app.companyName,
      schoolId: 'school-1',
      schoolName: '华东理工大学',
      startDate,
      endDate,
      studentSigned: false,
      companySigned: false,
      schoolSigned: false,
      status: 'pending_student',
    })
  }

  const handleAcceptOffer = (app: Application) => {
    updateApplicationStatus(app.id, 'accepted')
    createAgreementIfNeeded(app)
  }

  const [activeTab, setActiveTab] = useState<ApplicationStatus | 'all'>('all')

  const studentId = user?.id ?? ''
  const applications = getApplicationsByStudent(studentId)
  const interviews = getInterviewsByStudent(studentId)

  const filtered = activeTab === 'all'
    ? applications
    : applications.filter((a) => a.status === activeTab)

  const getInterviewInfo = (applicationId: string) =>
    interviews.find((i) => i.applicationId === applicationId)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        我的投递
      </h1>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-teal-700 text-white'
                : 'text-slate-500 hover:bg-slate-100'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon={<FileText className="w-12 h-12" />}
          title="暂无投递记录"
          description="去岗位大厅看看心仪的实习机会吧"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((app) => {
            const interview = app.status === 'interview' ? getInterviewInfo(app.id) : undefined

            return (
              <div
                key={app.id}
                onClick={() => navigate(`/position/${app.positionId}`)}
                className="cursor-pointer rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{app.positionTitle}</h3>
                  <StatusBadge status={app.status} label={APPLICATION_STATUSES[app.status]} />
                </div>
                <p className="mt-1 text-sm text-slate-500">{app.companyName}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>投递于 {app.createdAt}</span>
                </div>

                {interview && (
                  <div className="mt-3 rounded-lg bg-blue-50 p-3 text-xs text-blue-700 space-y-1">
                    <p className="font-medium">面试信息</p>
                    <p>日期：{interview.interviewDate} {interview.interviewTime}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {interview.location}
                    </p>
                    {interview.note && <p>备注：{interview.note}</p>}
                  </div>
                )}

                {app.status === 'offered' && (
                  <div className="mt-4 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleAcceptOffer(app)}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 transition-colors"
                    >
                      <BadgeCheck className="h-3.5 w-3.5" /> 接受录用
                    </button>
                    <button
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <X className="h-3.5 w-3.5" /> 拒绝录用
                    </button>
                  </div>
                )}

                {app.status === 'accepted' && (
                  <div className="mt-4 space-y-2" onClick={(e) => e.stopPropagation()}>
                    <p className="text-sm text-emerald-600 font-medium">入职成功，请查看我的协议</p>
                    <Link
                      to="/student/agreements"
                      className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-800 transition-colors"
                    >
                      查看三方协议 <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
