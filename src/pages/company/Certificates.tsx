import { useState } from 'react'
import { Award, Eye } from 'lucide-react'
import { useAgreementStore } from '@/stores/useAgreementStore'
import { useCertificateStore } from '@/stores/useCertificateStore'
import { useAuthStore } from '@/stores/useAuthStore'
import Modal from '@/components/Modal'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

export default function Certificates() {
  const { user } = useAuthStore()
  const getAgreementsByCompany = useAgreementStore((s) => s.getAgreementsByCompany)
  const addCertificate = useCertificateStore((s) => s.addCertificate)
  const getCertificatesByCompany = useCertificateStore((s) => s.getCertificatesByCompany)
  const getCertificatesByAgreement = useCertificateStore((s) => s.getCertificatesByAgreement)

  const companyId = user?.companyId ?? 'company-1'
  const agreements = getAgreementsByCompany(companyId).filter((a) => a.status === 'completed')
  const existingCerts = getCertificatesByCompany(companyId)

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedAgr, setSelectedAgr] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [previewCert, setPreviewCert] = useState<string | null>(null)

  const openIssueModal = (agrId: string) => {
    setSelectedAgr(agrId)
    setComment('')
    setModalOpen(true)
  }

  const handleSubmit = () => {
    if (!selectedAgr) return
    const agr = agreements.find((a) => a.id === selectedAgr)
    if (!agr) return
    addCertificate({
      agreementId: agr.id,
      studentId: agr.studentId,
      studentName: agr.studentName,
      companyId: agr.companyId,
      companyName: agr.companyName,
      positionTitle: agr.positionTitle,
      startDate: agr.startDate,
      endDate: agr.endDate,
      comment,
    })
    setModalOpen(false)
    setSelectedAgr(null)
  }

  const hasCert = (agrId: string) => getCertificatesByAgreement(agrId).length > 0

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        实习证明
      </h1>

      {agreements.length === 0 ? (
        <Empty icon={<Award className="h-12 w-12" />} title="暂无可出具证明的协议" description="完成的协议将显示在这里" />
      ) : (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
              已完成协议
            </h2>
            <div className="space-y-3">
              {agreements.map((agr) => {
                const cert = hasCert(agr.id)
                return (
                  <div key={agr.id} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{agr.positionTitle}</h3>
                        <p className="text-sm text-slate-500">
                          学生：{agr.studentName} · {agr.schoolName}
                        </p>
                        <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {agr.startDate} ~ {agr.endDate}
                        </p>
                      </div>
                      {cert ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          <Award className="h-3.5 w-3.5" /> 已出具
                        </span>
                      ) : (
                        <button onClick={() => openIssueModal(agr.id)}
                          className="inline-flex items-center gap-1 rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-700 transition-colors">
                          <Award className="h-4 w-4" /> 出具实习证明
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {existingCerts.length > 0 && (
            <section>
              <h2 className="mb-3 text-lg font-semibold text-slate-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                已出具证明
              </h2>
              <div className="space-y-3">
                {existingCerts.map((cert) => (
                  <div key={cert.id} className="rounded-xl border border-slate-200 bg-white p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-slate-900">{cert.positionTitle}</h3>
                        <p className="text-sm text-slate-500">
                          学生：{cert.studentName}
                        </p>
                        <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {cert.startDate} ~ {cert.endDate}
                        </p>
                        {cert.comment && (
                          <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg px-3 py-2">{cert.comment}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          出具日期：{cert.issuedAt}
                        </span>
                        <button onClick={() => setPreviewCert(cert.id)}
                          className="inline-flex items-center gap-1 text-xs text-teal-700 hover:text-teal-800 transition-colors">
                          <Eye className="h-3.5 w-3.5" /> 预览
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="出具实习证明" size="lg">
        <div className="space-y-4">
          {selectedAgr && (() => {
            const agr = agreements.find((a) => a.id === selectedAgr)
            if (!agr) return null
            return (
              <div className="rounded-lg bg-slate-50 p-4 text-sm">
                <p className="font-medium text-slate-900">{agr.positionTitle}</p>
                <p className="text-slate-500">学生：{agr.studentName} · {agr.schoolName}</p>
                <p className="text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>{agr.startDate} ~ {agr.endDate}</p>
              </div>
            )
          })()}
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">评价评语</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)}
              rows={4} placeholder="请输入对该学生实习期间的评价..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-700 focus:outline-none focus:ring-1 focus:ring-teal-700" />
          </div>
          <button onClick={handleSubmit}
            className={cn('w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              comment.trim() ? 'bg-teal-700 text-white hover:bg-teal-800' : 'cursor-not-allowed bg-slate-200 text-slate-400')}>
            确认出具
          </button>
        </div>
      </Modal>

      <Modal isOpen={!!previewCert} onClose={() => setPreviewCert(null)} title="实习证明预览" size="lg">
        {previewCert && (() => {
          const cert = existingCerts.find((c) => c.id === previewCert)
          if (!cert) return null
          return (
            <div className="space-y-4 rounded-lg border border-teal-200 bg-teal-50/30 p-6">
              <h3 className="text-center text-xl font-bold text-teal-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                实习证明
              </h3>
              <div className="space-y-2 text-sm text-slate-700">
                <p>兹证明 <span className="font-medium text-slate-900">{cert.studentName}</span> 同学于
                  <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}> {cert.startDate} </span>至
                  <span className="font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}> {cert.endDate} </span>
                  在 <span className="font-medium text-slate-900">{cert.companyName}</span> 担任
                  <span className="font-medium text-slate-900">{cert.positionTitle}</span> 实习。
                </p>
                {cert.comment && <p className="mt-2 text-slate-600">评语：{cert.comment}</p>}
              </div>
              <div className="pt-4 text-right text-xs text-slate-400" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                出具日期：{cert.issuedAt}
              </div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}
