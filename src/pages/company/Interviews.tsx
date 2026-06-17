import { useState } from 'react'
import { Send, Calendar } from 'lucide-react'
import { usePositionStore } from '@/stores/usePositionStore'
import { useInterviewStore } from '@/stores/useInterviewStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { INTERVIEW_STATUSES, type InterviewStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

const TABS: { key: InterviewStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待确认' },
  { key: 'confirmed', label: '已确认' },
  { key: 'completed', label: '已完成' },
  { key: 'cancelled', label: '已取消' },
]

export default function Interviews() {
  const { user } = useAuthStore()
  const getPositionsByCompany = usePositionStore((s) => s.getPositionsByCompany)
  const getInterviewsByPosition = useInterviewStore((s) => s.getInterviewsByPosition)
  const updateInterviewStatus = useInterviewStore((s) => s.updateInterviewStatus)

  const companyId = user?.companyId ?? 'company-1'
  const positions = getPositionsByCompany(companyId)
  const allInterviews = positions.flatMap((p) => getInterviewsByPosition(p.id))

  const [tab, setTab] = useState<InterviewStatus | 'all'>('all')
  const filtered = tab === 'all' ? allInterviews : allInterviews.filter((i) => i.status === tab)

  const handleSendNotification = (id: string) => {
    updateInterviewStatus(id, 'confirmed')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        面试管理
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
        <Empty icon={<Calendar className="h-12 w-12" />} title="暂无面试" description="还没有安排面试" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">学生姓名</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">面试职位</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">日期</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">时间</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">地点</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">状态</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((interview) => (
                <tr key={interview.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{interview.studentName}</td>
                  <td className="px-4 py-3 text-slate-600">{interview.positionTitle}</td>
                  <td className="px-4 py-3 text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>{interview.interviewDate}</td>
                  <td className="px-4 py-3 text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>{interview.interviewTime}</td>
                  <td className="px-4 py-3 text-slate-600">{interview.location}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={interview.status} label={INTERVIEW_STATUSES[interview.status]} />
                  </td>
                  <td className="px-4 py-3">
                    {interview.status === 'pending' && (
                      <button onClick={() => handleSendNotification(interview.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 transition-colors">
                        <Send className="h-3.5 w-3.5" /> 发送通知
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
