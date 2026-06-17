import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react'
import {
  BarChart, LineChart, RadarChart, Bar, Line, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import StatsCard from '@/components/StatsCard'
import { useApplicationStore } from '@/stores/useApplicationStore'
import { useAgreementStore } from '@/stores/useAgreementStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'
import { usePositionStore } from '@/stores/usePositionStore'
import { useReviewStore } from '@/stores/useReviewStore'
import { useCertificateStore } from '@/stores/useCertificateStore'
import { mockUsers } from '@/data/mockData'
import type { Evaluation } from '@/types'

export default function Dashboard() {
  const applications = useApplicationStore((s) => s.applications)
  const agreements = useAgreementStore((s) => s.agreements)
  const evaluations = useEvaluationStore((s) => s.evaluations)
  const positions = usePositionStore((s) => s.positions)
  const reviews = useReviewStore((s) => s.reviews)
  const certificates = useCertificateStore((s) => s.certificates)

  const totalStudents = mockUsers.filter((u) => u.role === 'student').length
  const approvedCompanies = reviews.filter((r) => r.status === 'approved').length
  const activeInternships = agreements.filter((a) => a.status === 'completed').length
  const completionRate = agreements.length === 0 ? 0 : Math.round((certificates.length / agreements.length) * 100)

  const acceptedApps = applications.filter((a) => a.status === 'accepted' || a.status === 'offered')
  const majorMap = new Map<string, number>()
  acceptedApps.forEach((a) => {
    const m = a.studentMajor || '其他'
    majorMap.set(m, (majorMap.get(m) || 0) + 1)
  })
  const majorData = Array.from(majorMap.entries()).map(([major, count]) => ({ major, count }))
  if (majorData.length === 0) {
    majorData.push({ major: '暂无数据', count: 0 })
  }

  const monthlyMap = new Map<string, { total: number; hired: number }>()
  applications.forEach((a) => {
    const dateStr = a.createdAt || a.updatedAt
    const match = dateStr.match(/^(\d{4})-(\d{2})/)
    if (!match) return
    const monthKey = `${parseInt(match[2], 10)}月`
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { total: 0, hired: 0 })
    }
    const entry = monthlyMap.get(monthKey)!
    entry.total++
    if (a.status === 'accepted' || a.status === 'offered') {
      entry.hired++
    }
  })
  let monthlyData = Array.from(monthlyMap.entries())
    .map(([month, v]) => ({ month, rate: Math.round((v.hired / (v.total || 1)) * 100) }))
  if (monthlyData.length < 3) {
    const fallbackMonths = ['11月', '12月', '1月', '2月', '3月', '4月']
    const existing = new Set(monthlyData.map((d) => d.month))
    fallbackMonths.forEach((m) => {
      if (!existing.has(m)) {
        monthlyData.push({ month: m, rate: 0 })
      }
    })
    monthlyData = monthlyData.slice(0, 6)
  }

  const posCompanyMap = new Map(positions.map((p) => [p.id, p.companyName]))
  const byCompany = new Map<string, { total: number; hired: number }>()
  applications.forEach((a) => {
    const c = posCompanyMap.get(a.positionId) || a.companyName || '未知企业'
    if (!byCompany.has(c)) {
      byCompany.set(c, { total: 0, hired: 0 })
    }
    const s = byCompany.get(c)!
    s.total++
    if (a.status === 'accepted' || a.status === 'offered') {
      s.hired++
    }
  })
  const companyData = Array.from(byCompany.entries())
    .map(([company, v]) => ({ company, rate: Math.round((v.hired / (v.total || 1)) * 100) }))
  if (companyData.length === 0) {
    companyData.push({ company: '暂无数据', rate: 0 })
  }

  const n = evaluations.length || 1
  const avg = (key: keyof Evaluation) =>
    Math.round((evaluations.reduce((s, e) => s + ((e[key] as number) || 0), 0) / n) * 10) / 10
  const avgOverall =
    Math.round((evaluations.reduce((s, e) => s + (e.overallScore || 0), 0) / n) * 10) / 10
  const satisfactionData =
    evaluations.length === 0
      ? [
          { dimension: '工作态度', score: 4.0 },
          { dimension: '专业能力', score: 4.0 },
          { dimension: '团队协作', score: 4.0 },
          { dimension: '主动性', score: 4.0 },
          { dimension: '综合评分', score: 4.0 },
        ]
      : [
          { dimension: '工作态度', score: avg('workAttitude') },
          { dimension: '专业能力', score: avg('professionalSkill') },
          { dimension: '团队协作', score: avg('teamwork') },
          { dimension: '主动性', score: avg('initiative') },
          { dimension: '综合评分', score: avgOverall },
        ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        数据看板
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="学生总数" value={totalStudents} icon={<Users className="h-5 w-5" />} trend="+0" />
        <StatsCard label="合作企业" value={approvedCompanies} icon={<Building2 className="h-5 w-5" />} trend="+0" />
        <StatsCard label="在岗实习" value={activeInternships} icon={<Briefcase className="h-5 w-5" />} trend="+0" />
        <StatsCard label="完成率" value={`${completionRate}%`} icon={<TrendingUp className="h-5 w-5" />} trend="+0" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">实习去向分布</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={majorData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="major" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} name="人数" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">各月录用率趋势</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} unit="%" />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#0f766e"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0f766e' }}
                name="录用率"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">企业录用率</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={companyData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} unit="%" />
              <YAxis dataKey="company" type="category" tick={{ fontSize: 12 }} width={90} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" fill="#d97706" radius={[0, 4, 4, 0]} name="录用率" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold text-slate-900">满意度评价</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={satisfactionData}>
              <PolarAngleAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Radar name="评分" dataKey="score" stroke="#0f766e" fill="#0f766e" fillOpacity={0.25} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
