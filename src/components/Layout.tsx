import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/useAuthStore'
import type { UserRole } from '@/types'
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Calendar,
  FileCheck,
  ClipboardList,
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Users,
  BarChart3,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  path: string
  icon: React.ReactNode
}

const studentNav: NavItem[] = [
  { label: '岗位大厅', path: '/', icon: <Briefcase className="w-5 h-5" /> },
  { label: '我的投递', path: '/student/applications', icon: <FileText className="w-5 h-5" /> },
  { label: '实习日志', path: '/student/logs', icon: <BookOpen className="w-5 h-5" /> },
  { label: '我的协议', path: '/student/agreements', icon: <FileCheck className="w-5 h-5" /> },
  { label: '实习证明', path: '/student/certificates', icon: <Award className="w-5 h-5" /> },
]

const companyNav: NavItem[] = [
  { label: '岗位大厅', path: '/', icon: <Briefcase className="w-5 h-5" /> },
  { label: '发布岗位', path: '/company/post', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: '岗位管理', path: '/company/positions', icon: <Building2 className="w-5 h-5" /> },
  { label: '简历筛选', path: '/company/applications', icon: <ClipboardList className="w-5 h-5" /> },
  { label: '面试安排', path: '/company/interviews', icon: <Calendar className="w-5 h-5" /> },
  { label: '协议管理', path: '/company/agreements', icon: <FileCheck className="w-5 h-5" /> },
  { label: '实习评估', path: '/company/evaluations', icon: <BarChart3 className="w-5 h-5" /> },
  { label: '实习证明', path: '/company/certificates', icon: <Award className="w-5 h-5" /> },
]

const schoolNav: NavItem[] = [
  { label: '岗位大厅', path: '/', icon: <Briefcase className="w-5 h-5" /> },
  { label: '资质审核', path: '/school/reviews', icon: <Shield className="w-5 h-5" /> },
  { label: '岗位审核', path: '/school/position-reviews', icon: <Briefcase className="w-5 h-5" /> },
  { label: '数据看板', path: '/school/dashboard', icon: <BarChart3 className="w-5 h-5" /> },
  { label: '协议签署', path: '/school/agreements', icon: <FileCheck className="w-5 h-5" /> },
]

const roleNavMap: Record<UserRole, NavItem[]> = {
  student: studentNav,
  company_hr: companyNav,
  company_mentor: [
    { label: '岗位大厅', path: '/', icon: <Briefcase className="w-5 h-5" /> },
    { label: '实习评估', path: '/company/evaluations', icon: <BarChart3 className="w-5 h-5" /> },
  ],
  school_teacher: schoolNav,
  school_admin: schoolNav,
}

const roleLabels: Record<UserRole, string> = {
  student: '学生',
  company_hr: '企业HR',
  company_mentor: '带教老师',
  school_teacher: '就业指导老师',
  school_admin: '学校管理员',
}

const roleColors: Record<UserRole, string> = {
  student: 'bg-blue-500',
  company_hr: 'bg-amber-500',
  company_mentor: 'bg-purple-500',
  school_teacher: 'bg-teal-500',
  school_admin: 'bg-teal-700',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [roleMenuOpen, setRoleMenuOpen] = useState(false)

  const navItems = user ? roleNavMap[user.role] : studentNav

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const switchRole = useAuthStore((s) => s.switchRole)

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center px-4 lg:px-6">
        <button
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 ml-2 lg:ml-0">
          <div className="w-8 h-8 bg-teal-700 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-800 hidden sm:block" style={{ fontFamily: 'Noto Serif SC, serif' }}>
            实习桥
          </span>
        </Link>

        {user && (
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium', roleColors[user.role])}>
                  {user.name[0]}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-medium text-slate-700">{user.name}</div>
                  <div className="text-xs text-slate-500">{roleLabels[user.role]}</div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <div className="text-sm font-medium text-slate-800">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                  <div className="px-3 py-2">
                    <div className="text-xs text-slate-400 mb-1.5">切换角色体验</div>
                    {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                      <button
                        key={role}
                        onClick={() => {
                          switchRole(role)
                          setRoleMenuOpen(false)
                          navigate('/')
                        }}
                        className={cn(
                          'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2',
                          user.role === role
                            ? 'bg-teal-50 text-teal-700 font-medium'
                            : 'text-slate-600 hover:bg-slate-50'
                        )}
                      >
                        <div className={cn('w-2 h-2 rounded-full', roleColors[role])} />
                        {roleLabels[role]}
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      退出登录
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {user && (
        <>
          <div
            className={cn(
              'fixed inset-0 bg-black/30 z-30 lg:hidden transition-opacity',
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
            onClick={() => setSidebarOpen(false)}
          />

          <aside
            className={cn(
              'fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300 lg:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}
          >
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                >
                  <span className="text-slate-400">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}

      <main className={cn('pt-16', user ? 'lg:pl-64' : '')}>
        <div className="max-w-7xl mx-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
