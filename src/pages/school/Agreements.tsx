import { Check, X as XIcon } from 'lucide-react'
import { useAgreementStore } from '@/stores/useAgreementStore'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { AGREEMENT_STATUSES } from '@/types'
import { cn } from '@/lib/utils'

export default function Agreements() {
  const getAgreementsBySchool = useAgreementStore((s) => s.getAgreementsBySchool)
  const signBySchool = useAgreementStore((s) => s.signBySchool)

  const agreements = getAgreementsBySchool('school-1')

  if (agreements.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          协议签署
        </h1>
        <Empty
          icon={<Check className="w-12 h-12" />}
          title="暂无待签协议"
          description="学生和企业签署完成后将出现在此处"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        协议签署
      </h1>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-4 py-3 text-left font-semibold text-slate-700">学生姓名</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">实习企业</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">实习岗位</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">起止日期</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">签署进度</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">状态</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-700">操作</th>
            </tr>
          </thead>
          <tbody>
            {agreements.map((agr) => {
              const steps = [
                { label: '学生', done: agr.studentSigned },
                { label: '企业', done: agr.companySigned },
                { label: '学校', done: agr.schoolSigned },
              ]

              return (
                <tr key={agr.id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{agr.studentName}</td>
                  <td className="px-4 py-3 text-slate-700">{agr.companyName}</td>
                  <td className="px-4 py-3 text-slate-700">{agr.positionTitle}</td>
                  <td className="px-4 py-3 text-slate-500">
                    <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{agr.startDate}</span>
                    {' ~ '}
                    <span style={{ fontFamily: 'DM Sans, sans-serif' }}>{agr.endDate}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {steps.map((step, idx) => (
                        <span key={step.label} className="inline-flex items-center gap-0.5">
                          {step.done ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-700 text-white">
                              <Check className="h-3 w-3" />
                            </span>
                          ) : (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-400">
                              <XIcon className="h-3 w-3" />
                            </span>
                          )}
                          {idx < steps.length - 1 && (
                            <div className="mx-0.5 h-px w-3 bg-slate-200" />
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={agr.status} label={AGREEMENT_STATUSES[agr.status]} />
                  </td>
                  <td className="px-4 py-3">
                    {agr.status === 'pending_school' ? (
                      <button
                        onClick={() => signBySchool(agr.id)}
                        className="rounded-lg bg-teal-700 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-teal-800"
                      >
                        学校签署
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
