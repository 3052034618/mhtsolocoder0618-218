import { useState } from 'react'
import { FileCheck, PenLine, User, Building2, GraduationCap } from 'lucide-react'
import { useAgreementStore } from '@/stores/useAgreementStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { AGREEMENT_STATUSES } from '@/types'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

const SIGNING_STEPS = [
  { key: 'student', label: '学生', icon: User },
  { key: 'company', label: '企业', icon: Building2 },
  { key: 'school', label: '学校', icon: GraduationCap },
] as const

export default function Agreements() {
  const { user } = useAuthStore()
  const getAgreementsByCompany = useAgreementStore((s) => s.getAgreementsByCompany)
  const signByCompany = useAgreementStore((s) => s.signByCompany)

  const companyId = user?.companyId ?? 'company-1'
  const agreements = getAgreementsByCompany(companyId)

  const [filter, setFilter] = useState<string>('all')

  const filtered = filter === 'all' ? agreements : agreements.filter((a) => a.status === filter)

  const isSigned = (agr: typeof agreements[0], step: string) => {
    if (step === 'student') return agr.studentSigned
    if (step === 'company') return agr.companySigned
    return agr.schoolSigned
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        三方协议
      </h1>

      <div className="mb-4 flex gap-1 rounded-lg border border-slate-200 bg-white p-1">
        <button onClick={() => setFilter('all')}
          className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            filter === 'all' ? 'bg-teal-700 text-white' : 'text-slate-500 hover:bg-slate-100')}>
          全部
        </button>
        {Object.entries(AGREEMENT_STATUSES).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              filter === key ? 'bg-teal-700 text-white' : 'text-slate-500 hover:bg-slate-100')}>
            {label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Empty icon={<FileCheck className="h-12 w-12" />} title="暂无协议" description="还没有相关协议" />
      ) : (
        <div className="space-y-4">
          {filtered.map((agr) => (
            <div key={agr.id} className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{agr.positionTitle}</h3>
                  <p className="text-sm text-slate-500">
                    学生：{agr.studentName} · 学校：{agr.schoolName}
                  </p>
                  <p className="text-xs text-slate-400 mt-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    {agr.startDate} ~ {agr.endDate}
                  </p>
                </div>
                <StatusBadge status={agr.status} label={AGREEMENT_STATUSES[agr.status]} />
              </div>

              <div className="mb-4 flex items-center justify-center gap-6">
                {SIGNING_STEPS.map((step, idx) => {
                  const Icon = step.icon
                  const signed = isSigned(agr, step.key)
                  return (
                    <div key={step.key} className="flex items-center gap-2">
                      {idx > 0 && <div className={cn('h-px w-8', signed ? 'bg-green-400' : 'bg-slate-200')} />}
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          signed ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className={cn('text-xs', signed ? 'text-green-600 font-medium' : 'text-slate-400')}>
                          {step.label}
                        </span>
                        <div className={cn('h-2 w-2 rounded-full', signed ? 'bg-green-500' : 'bg-slate-300')} />
                      </div>
                    </div>
                  )
                })}
              </div>

              {!agr.companySigned && (
                <div className="flex justify-end border-t border-slate-100 pt-3">
                  <button onClick={() => signByCompany(agr.id)}
                    className="inline-flex items-center gap-1 rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800 transition-colors">
                    <PenLine className="h-4 w-4" /> 企业签署
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
