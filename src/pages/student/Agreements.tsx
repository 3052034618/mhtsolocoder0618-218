import { FileCheck, Check, User, Building2, GraduationCap } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useAgreementStore } from '@/stores/useAgreementStore'
import StatusBadge from '@/components/StatusBadge'
import Empty from '@/components/Empty'
import { AGREEMENT_STATUSES } from '@/types'
import { cn } from '@/lib/utils'

const signingSteps = [
  { key: 'student', label: '学生签署', icon: User },
  { key: 'company', label: '企业签署', icon: Building2 },
  { key: 'school', label: '学校签署', icon: GraduationCap },
] as const

export default function Agreements() {
  const user = useAuthStore((s) => s.user)
  const getAgreementsByStudent = useAgreementStore((s) => s.getAgreementsByStudent)
  const signByStudent = useAgreementStore((s) => s.signByStudent)

  const studentId = user?.id ?? ''
  const agreements = getAgreementsByStudent(studentId)

  const isStepDone = (agr: ReturnType<typeof getAgreementsByStudent>[number], step: string) => {
    if (step === 'student') return agr.studentSigned
    if (step === 'company') return agr.companySigned
    return agr.schoolSigned
  }

  if (agreements.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          我的协议
        </h1>
        <Empty
          icon={<FileCheck className="w-12 h-12" />}
          title="暂无协议"
          description="接受录用后即可生成实习协议"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        我的协议
      </h1>

      <div className="space-y-8">
        {agreements.map((agr) => (
          <div key={agr.id} className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mx-auto max-w-2xl rounded-lg bg-white p-8 shadow-lg border border-slate-100">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    实习协议书
                  </h2>
                </div>
                <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                  <p>
                    甲方（实习单位）：<span className="font-medium">{agr.companyName}</span>
                  </p>
                  <p>
                    乙方（实习学生）：<span className="font-medium">{agr.studentName}</span>
                  </p>
                  <p>
                    丙方（学校）：<span className="font-medium">{agr.schoolName}</span>
                  </p>
                  <p>
                    实习岗位：<span className="font-medium">{agr.positionTitle}</span>
                  </p>
                  <p>
                    实习期限：<span className="font-medium">{agr.startDate} 至 {agr.endDate}</span>
                  </p>
                  <p className="mt-4 text-slate-500">
                    三方本着自愿、平等的原则，就学生实习事宜达成如下协议，共同遵守执行。
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 text-xs text-slate-500">
                  <div>
                    <p>学生签字</p>
                    {agr.studentSigned && agr.studentSignDate && (
                      <p className="mt-1 text-teal-700">{agr.studentSignDate}</p>
                    )}
                  </div>
                  <div>
                    <p>企业签字</p>
                    {agr.companySigned && agr.companySignDate && (
                      <p className="mt-1 text-teal-700">{agr.companySignDate}</p>
                    )}
                  </div>
                  <div>
                    <p>学校签字</p>
                    {agr.schoolSigned && agr.schoolSignDate && (
                      <p className="mt-1 text-teal-700">{agr.schoolSignDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900 mb-4">签署进度</h3>
                <div className="space-y-4">
                  {signingSteps.map((step, idx) => {
                    const done = isStepDone(agr, step.key)
                    const Icon = step.icon
                    return (
                      <div key={step.key} className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors',
                            done
                              ? 'border-teal-700 bg-teal-700 text-white'
                              : 'border-slate-300 text-slate-400'
                          )}
                        >
                          {done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                        </div>
                        <span className={cn('text-sm', done ? 'font-medium text-teal-700' : 'text-slate-500')}>
                          {step.label}
                        </span>
                        {idx < signingSteps.length - 1 && (
                          <div className="ml-4 h-px flex-1 bg-slate-200" />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">当前状态</span>
                  <StatusBadge status={agr.status} label={AGREEMENT_STATUSES[agr.status]} />
                </div>
                {!agr.studentSigned && (
                  <button
                    onClick={() => signByStudent(agr.id)}
                    className="mt-4 w-full rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-teal-800"
                  >
                    学生签署
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
