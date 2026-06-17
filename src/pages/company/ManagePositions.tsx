import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EyeOff, Eye, Pencil, Briefcase } from 'lucide-react'
import { usePositionStore } from '@/stores/usePositionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { POSITION_STATUSES, type PositionStatus } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

const TABS: { key: PositionStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'draft', label: '草稿' },
  { key: 'pending_review', label: '待审核' },
  { key: 'approved', label: '已上线' },
  { key: 'offline', label: '已下线' },
]

export default function ManagePositions() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const getPositionsByCompany = usePositionStore((s) => s.getPositionsByCompany)
  const updatePositionStatus = usePositionStore((s) => s.updatePositionStatus)

  const companyId = user?.companyId ?? 'company-1'
  const companyPositions = getPositionsByCompany(companyId)
  const [tab, setTab] = useState<PositionStatus | 'all'>('all')

  const filtered = tab === 'all' ? companyPositions : companyPositions.filter((p) => p.status === tab)

  const toggleOnline = (id: string, status: PositionStatus) => {
    updatePositionStatus(id, status === 'approved' ? 'offline' : 'approved')
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          职位管理
        </h1>
        <button onClick={() => navigate('/company/post-position')}
          className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
          <Briefcase className="h-4 w-4" /> 发布职位
        </button>
      </div>

      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              tab === t.key ? 'bg-teal-700 text-white' : 'text-slate-500 hover:bg-slate-100')}>
            {t.label}
            <span className="ml-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
              {t.key === 'all' ? companyPositions.length : companyPositions.filter((p) => p.status === t.key).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty icon={<Briefcase className="h-12 w-12" />} title="暂无职位" description="还没有符合条件的职位" />
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-500">职位名称</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">部门</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">城市</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">薪资</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">状态</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">创建时间</th>
                <th className="px-4 py-3 text-left font-medium text-slate-500">操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pos) => (
                <tr key={pos.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{pos.title}</td>
                  <td className="px-4 py-3 text-slate-600">{pos.department}</td>
                  <td className="px-4 py-3 text-slate-600">{pos.city}</td>
                  <td className="px-4 py-3 text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>{pos.salary}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={pos.status} label={POSITION_STATUSES[pos.status]} />
                  </td>
                  <td className="px-4 py-3 text-slate-500" style={{ fontFamily: 'DM Sans, sans-serif' }}>{pos.createdAt}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => navigate(`/company/post-position?id=${pos.id}`)}
                        className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-teal-700 hover:bg-teal-50 transition-colors">
                        <Pencil className="h-3.5 w-3.5" /> 编辑
                      </button>
                      {(pos.status === 'approved' || pos.status === 'offline') && (
                        <button onClick={() => toggleOnline(pos.id, pos.status)}
                          className={cn('inline-flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors',
                            pos.status === 'approved'
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50')}>
                          {pos.status === 'approved'
                            ? <><EyeOff className="h-3.5 w-3.5" /> 下线</>
                            : <><Eye className="h-3.5 w-3.5" /> 上线</>}
                        </button>
                      )}
                    </div>
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
