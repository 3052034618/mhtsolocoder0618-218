import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Building2, Briefcase, ThumbsUp, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { usePositionStore } from '@/stores/usePositionStore'
import { useAuthStore } from '@/stores/useAuthStore'
import { MAJORS, CITIES, DURATIONS } from '@/types'
import Empty from '@/components/Empty'

const SALARY_OPTIONS = [
  { value: '', label: '不限' },
  { value: '150以下', label: '150以下' },
  { value: '150-250', label: '150-250' },
  { value: '250以上', label: '250以上' },
]

const STATS = [
  { icon: Building2, value: '500+', label: '合作企业' },
  { icon: Briefcase, value: '2000+', label: '实习岗位' },
  { icon: ThumbsUp, value: '98%', label: '满意度' },
]

const LOGO_COLORS = [
  'bg-teal-600', 'bg-amber-600', 'bg-blue-600',
  'bg-purple-600', 'bg-rose-600', 'bg-emerald-600',
]

function getLogoColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return LOGO_COLORS[Math.abs(hash) % LOGO_COLORS.length]
}

export default function Home() {
  const user = useAuthStore((s) => s.user)
  const getApprovedPositions = usePositionStore((s) => s.getApprovedPositions)
  const positions = getApprovedPositions()

  const [search, setSearch] = useState('')
  const [selectedMajors, setSelectedMajors] = useState<string[]>([])
  const [salary, setSalary] = useState('')
  const [duration, setDuration] = useState('')
  const [city, setCity] = useState('')

  const filtered = useMemo(() => {
    return positions.filter((p) => {
      if (search && !p.title.includes(search) && !p.companyName.includes(search)) return false
      if (selectedMajors.length > 0 && !selectedMajors.some((m) => p.majorRequired.includes(m))) return false
      if (city && p.city !== city) return false
      if (duration && p.duration !== duration) return false
      if (salary) {
        const numStr = p.salary.match(/(\d+)/g)
        if (!numStr) return false
        const low = parseInt(numStr[0])
        if (salary === '150以下' && low >= 150) return false
        if (salary === '150-250' && (low < 150 || low >= 250)) return false
        if (salary === '250以上' && low < 250) return false
      }
      return true
    })
  }, [positions, search, selectedMajors, salary, duration, city])

  const sorted = useMemo(() => {
    if (user?.role === 'student' && user.major) {
      return [...filtered].sort((a, b) => {
        const aMatch = a.majorRequired.includes(user.major!) ? 0 : 1
        const bMatch = b.majorRequired.includes(user.major!) ? 0 : 1
        return aMatch - bMatch
      })
    }
    return filtered
  }, [filtered, user])

  const toggleMajor = (major: string) => {
    setSelectedMajors((prev) =>
      prev.includes(major) ? prev.filter((m) => m !== major) : [...prev, major]
    )
  }

  const resetFilters = () => {
    setSearch('')
    setSelectedMajors([])
    setSalary('')
    setDuration('')
    setCity('')
  }

  const hasFilters = search || selectedMajors.length > 0 || salary || duration || city

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-teal-700 to-teal-600 px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <h1
            className="text-4xl font-bold tracking-tight"
            style={{ fontFamily: '"Noto Serif SC", serif' }}
          >
            发现你的实习机会
          </h1>
          <p className="mt-3 text-lg text-teal-100">
            连接优质企业，开启职业旅程
          </p>
          <div className="relative mx-auto mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索职位或公司..."
              className="w-full rounded-xl bg-white py-3.5 pl-12 pr-4 text-slate-900 shadow-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div className="mt-10 flex justify-center gap-6">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={cn(
                  'rounded-xl bg-white/10 px-6 py-4 backdrop-blur-sm transition-all duration-500',
                  'hover:bg-white/20 hover:-translate-y-1',
                  'animate-in fade-in slide-in-from-bottom-4'
                )}
                style={{ animationDelay: `${i * 150}ms`, animationFillMode: 'both' }}
              >
                <stat.icon className="mx-auto mb-2 h-6 w-6 text-amber-400" />
                <p
                  className="text-2xl font-bold"
                  style={{ fontFamily: '"DM Sans", sans-serif' }}
                >
                  {stat.value}
                </p>
                <p className="text-sm text-teal-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 rounded-xl bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">筛选条件</h3>
                {hasFilters && (
                  <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-teal-700"
                  >
                    <RotateCcw className="h-3 w-3" />
                    重置
                  </button>
                )}
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-slate-700">专业方向</p>
                <div className="max-h-48 space-y-1.5 overflow-y-auto">
                  {MAJORS.map((major) => (
                    <label key={major} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        checked={selectedMajors.includes(major)}
                        onChange={() => toggleMajor(major)}
                        className="h-4 w-4 rounded border-slate-300 text-teal-700 focus:ring-teal-500"
                      />
                      <span className="truncate">{major}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-slate-700">薪资范围</p>
                <div className="space-y-1.5">
                  {SALARY_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="salary"
                        checked={salary === opt.value}
                        onChange={() => setSalary(opt.value)}
                        className="h-4 w-4 border-slate-300 text-teal-700 focus:ring-teal-500"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="mb-2 text-sm font-medium text-slate-700">实习时长</p>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">不限</option>
                  {DURATIONS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-700">工作城市</p>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-teal-500 focus:outline-none"
                >
                  <option value="">不限</option>
                  {CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </aside>

          <main className="min-w-0 flex-1">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-slate-500">
                共 <span className="font-medium text-slate-900" style={{ fontFamily: '"DM Sans", sans-serif' }}>{sorted.length}</span> 个职位
              </p>
            </div>

            {sorted.length === 0 ? (
              <Empty
                icon={<Briefcase className="h-12 w-12" />}
                title="暂无匹配职位"
                description="尝试调整筛选条件查看更多职位"
                action={
                  hasFilters ? (
                    <button
                      onClick={resetFilters}
                      className="rounded-lg bg-teal-700 px-4 py-2 text-sm text-white hover:bg-teal-800"
                    >
                      重置筛选
                    </button>
                  ) : undefined
                }
              />
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((pos) => (
                  <Link
                    key={pos.id}
                    to={`/position/${pos.id}`}
                    className="group rounded-xl bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white',
                          getLogoColor(pos.companyName)
                        )}
                      >
                        {pos.companyLogo || pos.companyName[0]}
                      </div>
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-slate-900 group-hover:text-teal-700">
                          {pos.title}
                        </h3>
                        <p className="truncate text-sm text-slate-500">{pos.companyName}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {pos.majorRequired.slice(0, 2).map((m) => (
                        <span key={m} className="rounded-full bg-teal-50 px-2 py-0.5 text-xs text-teal-700">
                          {m}
                        </span>
                      ))}
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {pos.city}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        {pos.duration}
                      </span>
                      <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                        {pos.salary}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
