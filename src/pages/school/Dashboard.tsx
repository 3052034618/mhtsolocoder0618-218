import { Users, Building2, Briefcase, TrendingUp } from 'lucide-react'
import {
  BarChart, LineChart, RadarChart, Bar, Line, Radar,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts'
import StatsCard from '@/components/StatsCard'

const majorData = [
  { major: '计算机科学与技术', count: 45 },
  { major: '软件工程', count: 38 },
  { major: '金融学', count: 22 },
  { major: '市场营销', count: 18 },
  { major: '人工智能', count: 15 },
  { major: '通信工程', count: 12 },
  { major: '法学', count: 8 },
]

const monthlyData = [
  { month: '9月', rate: 65 },
  { month: '10月', rate: 72 },
  { month: '11月', rate: 68 },
  { month: '12月', rate: 78 },
]

const companyData = [
  { company: '远景科技', rate: 75 },
  { company: '金未来金融', rate: 60 },
  { company: '数智科技', rate: 82 },
]

const satisfactionData = [
  { dimension: '薪资福利', score: 4.2 },
  { dimension: '工作内容', score: 4.5 },
  { dimension: '带教质量', score: 3.8 },
  { dimension: '工作环境', score: 4.1 },
  { dimension: '发展前景', score: 3.9 },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        数据看板
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard label="学生总数" value={1286} icon={<Users className="h-5 w-5" />} trend="+5.2%" />
        <StatsCard label="合作企业" value={48} icon={<Building2 className="h-5 w-5" />} trend="+3" />
        <StatsCard label="在岗实习" value={324} icon={<Briefcase className="h-5 w-5" />} trend="+12%" />
        <StatsCard label="完成率" value="87%" icon={<TrendingUp className="h-5 w-5" />} trend="+2.1%" />
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
              <Line type="monotone" dataKey="rate" stroke="#0f766e" strokeWidth={2} dot={{ r: 4, fill: '#0f766e' }} name="录用率" />
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
