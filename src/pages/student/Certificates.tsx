import { Award, Download } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useCertificateStore } from '@/stores/useCertificateStore'
import Empty from '@/components/Empty'

export default function Certificates() {
  const user = useAuthStore((s) => s.user)
  const getCertificatesByStudent = useCertificateStore((s) => s.getCertificatesByStudent)

  const studentId = user?.id ?? ''
  const certificates = getCertificatesByStudent(studentId)

  if (certificates.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          实习证明
        </h1>
        <Empty
          icon={<Award className="w-12 h-12" />}
          title="暂无实习证明"
          description="完成实习后即可获得实习证明"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        实习证明
      </h1>

      <div className="grid gap-8 md:grid-cols-2">
        {certificates.map((cert) => (
          <div key={cert.id} className="flex flex-col items-center">
            <div className="w-full max-w-lg rounded-lg border-4 border-amber-400 bg-amber-50/30 p-8 relative">
              <div className="absolute top-4 right-4 text-amber-400 opacity-20">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div className="absolute bottom-4 left-4 text-amber-400 opacity-20">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                </svg>
              </div>

              <div className="text-center space-y-6 relative z-10">
                <div>
                  <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-teal-700 text-white">
                    <GraduationCapIcon />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
                    实习证明
                  </h2>
                </div>

                <div className="space-y-2 text-sm text-slate-700">
                  <p>
                    兹证明 <span className="font-semibold text-slate-900">{cert.studentName}</span> 同学
                  </p>
                  <p>
                    于 <span className="font-medium">{cert.startDate}</span> 至{' '}
                    <span className="font-medium">{cert.endDate}</span>
                  </p>
                  <p>
                    在 <span className="font-semibold text-slate-900">{cert.companyName}</span>{' '}
                    担任 <span className="font-medium">{cert.positionTitle}</span> 岗位实习
                  </p>
                  {cert.comment && (
                    <p className="mt-3 text-slate-500 italic">"{cert.comment}"</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-200">
                  <div className="text-left">
                    <div className="h-10 w-10 rounded-full border-2 border-red-400 flex items-center justify-center text-[8px] text-red-500 font-bold leading-tight text-center">
                      学校<br />盖章
                    </div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <p>颁发日期：{cert.issuedAt}</p>
                  </div>
                  <div className="text-right">
                    <div className="h-10 w-10 rounded-full border-2 border-red-400 flex items-center justify-center text-[8px] text-red-500 font-bold leading-tight text-center">
                      企业<br />盖章
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => {}}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              <Download className="h-4 w-4" />
              下载证明
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function GraduationCapIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
}
