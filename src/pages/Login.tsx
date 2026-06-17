import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import type { UserRole } from '@/types'
import { GraduationCap, Eye, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const roles: { value: UserRole; label: string; color: string }[] = [
  { value: 'student', label: '学生', color: 'bg-blue-500' },
  { value: 'company_hr', label: '企业HR', color: 'bg-amber-500' },
  { value: 'company_mentor', label: '带教老师', color: 'bg-purple-500' },
  { value: 'school_teacher', label: '就业指导老师', color: 'bg-teal-500' },
  { value: 'school_admin', label: '学校管理员', color: 'bg-teal-700' },
]

const demoAccounts: Record<UserRole, string> = {
  student: 'zhangxm@edu.cn',
  company_hr: 'chen@techvision.com',
  company_mentor: 'zhou@techvision.com',
  school_teacher: 'wu@edu.cn',
  school_admin: 'zheng@edu.cn',
}

export default function Login() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [selectedRole, setSelectedRole] = useState<UserRole>('student')
  const [email, setEmail] = useState('zhangxm@edu.cn')
  const [password, setPassword] = useState('123456')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role)
    setEmail(demoAccounts[role])
    setError('')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(email, selectedRole)
    const user = useAuthStore.getState().user
    if (user) {
      navigate('/')
    } else {
      setError('登录失败，请检查邮箱和角色是否匹配')
    }
  }

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-700 via-teal-600 to-emerald-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-amber-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <GraduationCap className="w-8 h-8" />
            </div>
            <span className="text-3xl font-bold" style={{ fontFamily: 'Noto Serif SC, serif' }}>实习桥</span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-6" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            大学生实习岗位<br />发布与管理平台
          </h1>
          <p className="text-lg text-teal-100 leading-relaxed max-w-md">
            连接企业、学生和高校三方，实现从岗位发布、资质审核、简历投递、面试安排、在线签约到实习评估的全流程数字化管理
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>500+</div>
              <div className="text-sm text-teal-100 mt-1">合作企业</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>2000+</div>
              <div className="text-sm text-teal-100 mt-1">实习岗位</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <div className="text-3xl font-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>98%</div>
              <div className="text-sm text-teal-100 mt-1">满意度</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <div className="w-10 h-10 bg-teal-700 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'Noto Serif SC, serif' }}>实习桥</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2" style={{ fontFamily: 'Noto Serif SC, serif' }}>欢迎登录</h2>
            <p className="text-sm text-slate-500 mb-6">选择角色并登录平台</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {roles.map((r) => (
                <button
                  key={r.value}
                  onClick={() => handleRoleChange(r.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                    selectedRole === r.value
                      ? 'border-teal-700 bg-teal-50 text-teal-700 shadow-sm'
                      : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  )}
                >
                  <span className={cn('inline-block w-2 h-2 rounded-full mr-1.5', r.color)} />
                  {r.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm transition-all"
                  placeholder="请输入邮箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">密码</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm pr-10 transition-all"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg font-medium transition-colors shadow-sm"
              >
                登录
              </button>
            </form>

            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-700 font-medium mb-1">演示提示</p>
              <p className="text-xs text-amber-600">选择角色后点击登录即可体验，密码可随意输入</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
