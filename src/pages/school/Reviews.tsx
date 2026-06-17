import { useState } from 'react'
import { Shield, Eye, Building2, Scale, FileText } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useReviewStore } from '@/stores/useReviewStore'
import StatusBadge from '@/components/StatusBadge'
import Modal from '@/components/Modal'
import Empty from '@/components/Empty'
import { REVIEW_STATUSES } from '@/types'
import type { ReviewStatus, CompanyReview } from '@/types'
import { cn } from '@/lib/utils'

const filterTabs: { key: ReviewStatus | 'all'; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'pending', label: '待审核' },
  { key: 'approved', label: '已通过' },
  { key: 'rejected', label: '已驳回' },
]

export default function Reviews() {
  const user = useAuthStore((s) => s.user)
  const reviews = useReviewStore((s) => s.reviews)
  const approveReview = useReviewStore((s) => s.approveReview)
  const rejectReview = useReviewStore((s) => s.rejectReview)

  const [activeTab, setActiveTab] = useState<ReviewStatus | 'all'>('all')
  const [selectedReview, setSelectedReview] = useState<CompanyReview | null>(null)
  const [comment, setComment] = useState('')

  const filtered = activeTab === 'all'
    ? reviews
    : reviews.filter((r) => r.status === activeTab)

  const handleApprove = () => {
    if (!selectedReview) return
    approveReview(selectedReview.id, user?.id ?? '', user?.name ?? '', comment)
    setComment('')
    setSelectedReview(null)
  }

  const handleReject = () => {
    if (!selectedReview) return
    rejectReview(selectedReview.id, user?.id ?? '', user?.name ?? '', comment)
    setComment('')
    setSelectedReview(null)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        资质审核
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
          icon={<Shield className="w-12 h-12" />}
          title="暂无审核记录"
          description="当前没有需要审核的企业资质"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-700 text-sm font-bold">
                  {review.companyName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-slate-900 truncate">{review.companyName}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      {review.industry}
                    </span>
                    <span className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      {review.companyScale}
                    </span>
                  </div>
                </div>
                <StatusBadge status={review.status} label={REVIEW_STATUSES[review.status]} />
              </div>

              <p className="mt-3 text-xs text-slate-500 line-clamp-2">{review.companyIntro}</p>

              <div className="mt-3 flex items-center gap-1 text-xs text-slate-400">
                <FileText className="h-3 w-3" />
                <span>营业执照：{review.businessLicense}</span>
              </div>

              <button
                onClick={() => setSelectedReview(review)}
                className="mt-4 w-full rounded-lg border border-teal-200 bg-teal-50 py-2 text-sm font-medium text-teal-700 transition-colors hover:bg-teal-100"
              >
                查看详情
              </button>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={!!selectedReview}
        onClose={() => { setSelectedReview(null); setComment('') }}
        title="企业资质详情"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500">企业名称</span>
                <p className="font-medium text-slate-900">{selectedReview.companyName}</p>
              </div>
              <div>
                <span className="text-slate-500">所属行业</span>
                <p className="font-medium text-slate-900">{selectedReview.industry}</p>
              </div>
              <div>
                <span className="text-slate-500">企业规模</span>
                <p className="font-medium text-slate-900">{selectedReview.companyScale}</p>
              </div>
              <div>
                <span className="text-slate-500">营业执照</span>
                <p className="font-medium text-slate-900">{selectedReview.businessLicense}</p>
              </div>
            </div>
            <div>
              <span className="text-sm text-slate-500">企业简介</span>
              <p className="mt-1 text-sm text-slate-700">{selectedReview.companyIntro}</p>
            </div>

            {selectedReview.status === 'pending' && (
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

            {selectedReview.status !== 'pending' && selectedReview.reviewComment && (
              <div className="rounded-lg bg-slate-50 p-3 text-sm">
                <span className="text-slate-500">审核意见：</span>
                <span className="text-slate-700">{selectedReview.reviewComment}</span>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
