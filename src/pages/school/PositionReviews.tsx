import { useState } from 'react'
import { Briefcase, Building2, MapPin, Clock, Eye } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { usePositionStore } from '@/stores/usePositionStore'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import Empty from '@/components/Empty'
import { POSITION_STATUSES } from '@/types'
import type { PositionStatus, Position } from '@/types'
import { cn } from '@/lib/utils'

const filterTabs: { key: PositionStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending_review', label: '待审核' },
  { key: 'approved', label: '已上线' },
  { key: 'rejected', label: '已驳回' },
]

export default function PositionReviews() {
  const user = useAuthStore((s) => s.user)
  const positions = usePositionStore((s) => s.positions)
  const approvePosition = usePositionStore((s) => s.approvePosition)
  const rejectPosition = usePositionStore((s) => s.rejectPosition)

  const [activeTab, setActiveTab] = useState<PositionStatus | 'all'>('all')
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)
  const [comment, setComment] = useState('')

  const filtered = activeTab === 'all'
    ? positions
    : positions.filter((p) => p.status === activeTab)

  const handleApprove = () => {
    if (!selectedPosition) return
    approvePosition(selectedPosition.id, user?.id ?? '', user?.name ?? '', comment)
    setComment('')
    setSelectedPosition(null)
  }

  const handleReject = () => {
    if (!selectedPosition) return
    rejectPosition(selectedPosition.id, user?.id ?? '', user?.name ?? '', comment)
    setComment('')
    setSelectedPosition(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        岗位审核
      </h1>

      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {filterTabs.map((tab) => (
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
          icon={<Briefcase className="w-12 h-12" />}
          title="暂无岗位"
          description="当前没有符合条件的岗位"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((pos) => (
            <div
              key={pos.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 text-sm font-bold flex-shrink-0">
                    {pos.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 truncate">{pos.title}</h3>
                    <div className="mt-1 text-xs text-slate-500 truncate">
                      {pos.companyName} · {pos.department}
                    </div>
                  </div>
                </div>
                <StatusBadge status={pos.status} label={POSITION_STATUSES[pos.status]} />
              </div>

              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {pos.city}
                </span>
                <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{pos.salary}</span>
              </div>

              {pos.majorRequired.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {pos.majorRequired.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                <Clock className="h-3 w-3" />
                <span>实习周期：{pos.duration}</span>
              </div>

              <button
                onClick={() => setSelectedPosition(pos)}
                className="mt-4 w-full rounded-lg border border-teal-200 bg-teal-50 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100 flex items-center justify-center gap-1"
              >
                <Eye className="h-4 w-4" />
                查看详情
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedPosition}
        onClose={() => { setSelectedPosition(null); setComment('') }}
        title="岗位详情"
        size="lg"
      >
        {selectedPosition && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">职位名称</span>
                <p className="font-medium text-slate-900">{selectedPosition.title}</p>
              </div>
              <div>
                <span className="text-slate-500">公司名称</span>
                <p className="font-medium text-slate-900">{selectedPosition.companyName}</p>
              </div>
              <div>
                <span className="text-slate-500">部门</span>
                <p className="font-medium text-slate-900">{selectedPosition.department}</p>
              </div>
              <div>
                <span className="text-slate-500">城市</span>
                <p className="font-medium text-slate-900">{selectedPosition.city}</p>
              </div>
              <div>
                <span className="text-slate-500">薪资</span>
                <p className="font-medium text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>{selectedPosition.salary}</p>
              </div>
              <div>
                <span className="text-slate-500">实习周期</span>
                <p className="font-medium text-slate-900">{selectedPosition.duration}</p>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500">创建时间</span>
                <p className="font-medium text-slate-900" style={{ fontFamily: 'DM Sans, sans-serif' }}>{selectedPosition.createdAt}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-slate-500">岗位描述</span>
              <p className="mt-1 text-sm text-slate-700">{selectedPosition.description}</p>
            </div>
            <div>
              <span className="text-sm text-slate-500">任职要求</span>
              <ul className="mt-1 space-y-1 text-sm text-slate-700 list-disc list-inside">
                {selectedPosition.requirements.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
            {selectedPosition.majorRequired.length > 0 && (
              <div>
                <span className="text-sm text-slate-500">要求专业</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {selectedPosition.majorRequired.map((m) => (
                    <span
                      key={m}
                      className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedPosition.status === 'pending_review' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700">审核意见</label>
                  <textarea
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="请输入审核意见..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleApprove}
                    className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    通过
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
                  >
                    驳回
                  </button>
                </div>
              </>
            )}

            {selectedPosition.status !== 'pending_review' && selectedPosition.reviewComment && (
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-500">审核意见：</span>
                <span className="text-slate-700">{selectedPosition.reviewComment}</span>
                {selectedPosition.reviewedAt && (
                  <div className="mt-1 text-xs text-slate-400">
                    审核人：{selectedPosition.reviewerName} · 审核时间：{selectedPosition.reviewedAt}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
