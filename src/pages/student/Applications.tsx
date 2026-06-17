import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileText, Calendar, MapPin } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useApplicationStore } from '@/stores/useApplicationStore'
import { useInterviewStore } from '@/stores/useInterviewStore'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { APPLICATION_STATUSES } from '@/types'
import type { ApplicationStatus } from '@/types'
import { cn } from '@/lib/utils'

const statusTabs: { key: ApplicationStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待筛选' },
  { key: 'interview', label: '面试中' },
  { key: 'offered', label: '已录用' },
  { key: 'rejected', label: '已拒绝' },
]

export default function Applications() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const getApplicationsByStudent = useApplicationStore((s) => s.getApplicationsByStudent)
  const getInterviewsByStudent = useInterviewStore((s) => s.getInterviewsByStudent)

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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
