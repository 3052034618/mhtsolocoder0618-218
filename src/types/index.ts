export type UserRole = 'student' | 'company_hr' | 'company_mentor' | 'school_teacher' | 'school_admin'

export interface User {
  id: string
  role: UserRole
  name: string
  email: string
  avatar?: string
  schoolId?: string
  schoolName?: string
  companyId?: string
  companyName?: string
  major?: string
  studentNo?: string
}

export type PositionStatus = 'draft' | 'pending_review' | 'approved' | 'rejected' | 'offline'

export interface Position {
  id: string
  companyId: string
  companyName: string
  companyLogo: string
  title: string
  department: string
  description: string
  duration: string
  salary: string
  requirements: string[]
  majorRequired: string[]
  city: string
  status: PositionStatus
  createdAt: string
  updatedAt: string
  reviewerId?: string
  reviewerName?: string
  reviewComment?: string
  reviewedAt?: string
}

export type ApplicationStatus = 'pending' | 'screened' | 'interview' | 'rejected' | 'offered' | 'accepted'

export interface Application {
  id: string
  positionId: string
  positionTitle: string
  companyName: string
  studentId: string
  studentName: string
  studentMajor: string
  resumeUrl: string
  selfIntroduction: string
  status: ApplicationStatus
  createdAt: string
  updatedAt: string
}

export type InterviewStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Interview {
  id: string
  applicationId: string
  positionId: string
  studentId: string
  studentName: string
  companyName: string
  positionTitle: string
  interviewDate: string
  interviewTime: string
  location: string
  note?: string
  status: InterviewStatus
}

export type AgreementStatus = 'pending_student' | 'pending_company' | 'pending_school' | 'completed'

export interface Agreement {
  id: string
  applicationId: string
  positionId: string
  positionTitle: string
  studentId: string
  studentName: string
  companyId: string
  companyName: string
  schoolId: string
  schoolName: string
  startDate: string
  endDate: string
  studentSigned: boolean
  companySigned: boolean
  schoolSigned: boolean
  studentSignDate?: string
  companySignDate?: string
  schoolSignDate?: string
  status: AgreementStatus
}

export interface Evaluation {
  id: string
  agreementId: string
  studentId: string
  studentName: string
  mentorId: string
  mentorName: string
  month: string
  workAttitude: number
  professionalSkill: number
  teamwork: number
  initiative: number
  overallScore: number
  comment: string
  createdAt: string
}

export interface InternshipLog {
  id: string
  agreementId: string
  studentId: string
  date: string
  content: string
  harvest: string
  createdAt: string
}

export interface Certificate {
  id: string
  agreementId: string
  studentId: string
  studentName: string
  companyId: string
  companyName: string
  positionTitle: string
  startDate: string
  endDate: string
  comment: string
  issuedAt: string
}

export type ReviewStatus = 'pending' | 'approved' | 'rejected'

export interface CompanyReview {
  id: string
  companyId: string
  companyName: string
  companyLogo: string
  businessLicense: string
  companyIntro: string
  companyScale: string
  industry: string
  status: ReviewStatus
  reviewerId?: string
  reviewerName?: string
  reviewComment?: string
  reviewedAt?: string
  submittedAt: string
}

export const POSITION_STATUSES: Record<PositionStatus, string> = {
  draft: '草稿',
  pending_review: '待审核',
  approved: '已上线',
  rejected: '已驳回',
  offline: '已下线',
}

export const APPLICATION_STATUSES: Record<ApplicationStatus, string> = {
  pending: '待筛选',
  screened: '已筛选',
  interview: '进入面试',
  rejected: '已拒绝',
  offered: '已录用',
  accepted: '已接受',
}

export const INTERVIEW_STATUSES: Record<InterviewStatus, string> = {
  pending: '待确认',
  confirmed: '已确认',
  completed: '已完成',
  cancelled: '已取消',
}

export const AGREEMENT_STATUSES: Record<AgreementStatus, string> = {
  pending_student: '待学生签署',
  pending_company: '待企业签署',
  pending_school: '待学校签署',
  completed: '已完成',
}

export const REVIEW_STATUSES: Record<ReviewStatus, string> = {
  pending: '待审核',
  approved: '已通过',
  rejected: '已驳回',
}

export const MAJORS = [
  '计算机科学与技术',
  '软件工程',
  '数据科学与大数据技术',
  '人工智能',
  '电子信息工程',
  '通信工程',
  '金融学',
  '会计学',
  '市场营销',
  '工商管理',
  '英语',
  '法学',
  '机械工程',
  '土木工程',
  '建筑学',
  '新闻传播学',
]

export const CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '成都',
  '南京',
  '武汉',
  '西安',
  '重庆',
]

export const DURATIONS = [
  '1个月',
  '2个月',
  '3个月',
  '6个月',
  '12个月',
]
