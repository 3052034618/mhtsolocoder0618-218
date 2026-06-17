import { useState } from 'react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEvaluationStore } from '@/stores/useEvaluationStore'
import { useAgreementStore } from '@/stores/useAgreementStore'
import StarRating from '@/components/StarRating'
import Empty from '@/components/Empty'
import { ClipboardCheck, Plus } from 'lucide-react'

export default function Evaluations() {
  const user = useAuthStore((s) => s.user)
  const { evaluations, addEvaluation } = useEvaluationStore()
  const agreements = useAgreementStore((s) => s.agreements)
  const [showForm, setShowForm] = useState(false)
  const [selectedAgreement, setSelectedAgreement] = useState('')
  const [month, setMonth] = useState('2026-01')
  const [workAttitude, setWorkAttitude] = useState(4)
  const [professionalSkill, setProfessionalSkill] = useState(4)
  const [teamwork, setTeamwork] = useState(4)
  const [initiative, setInitiative] = useState(4)
  const [comment, setComment] = useState('')

  const companyId = user?.companyId || 'company-1'
  const companyAgreements = agreements.filter(
    (a) => a.companyId === companyId && a.status === 'completed'
  )

  const mentorEvals = evaluations.filter((e) => e.mentorId === (user?.id || 'mentor-1'))
  const allCompanyEvals = evaluations.filter((e) =>
    companyAgreements.some((a) => a.id === e.agreementId)
  )

  const handleSubmit = () => {
    if (!selectedAgreement) return
    const agreement = companyAgreements.find((a) => a.id === selectedAgreement)
    if (!agreement) return

    const overallScore = (workAttitude + professionalSkill + teamwork + initiative) / 4
    addEvaluation({
      agreementId: selectedAgreement,
      studentId: agreement.studentId,
      studentName: agreement.studentName,
      mentorId: user?.id || 'mentor-1',
      mentorName: user?.name || '周工',
      month,
      workAttitude,
      professionalSkill,
      teamwork,
      initiative,
      overallScore: Math.round(overallScore * 10) / 10,
      comment,
    })
    setShowForm(false)
    setSelectedAgreement('')
    setComment('')
    setWorkAttitude(4)
    setProfessionalSkill(4)
    setTeamwork(4)
    setInitiative(4)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-serif-sc">实习评估</h1>
          <p className="text-sm text-slate-500 mt-1">填写学生月度表现评估</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新建评估
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">新建月度评估</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">选择协议</label>
                <select
                  value={selectedAgreement}
                  onChange={(e) => setSelectedAgreement(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">请选择</option>
                  {companyAgreements.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.studentName} - {a.positionTitle}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">评估月份</label>
                <input
                  type="month"
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">工作态度</label>
                <StarRating value={workAttitude} onChange={setWorkAttitude} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">专业能力</label>
                <StarRating value={professionalSkill} onChange={setProfessionalSkill} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">团队协作</label>
                <StarRating value={teamwork} onChange={setTeamwork} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">主动性</label>
                <StarRating value={initiative} onChange={setInitiative} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">综合评语</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="请填写综合评语..."
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSubmit}
                disabled={!selectedAgreement || !comment}
                className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white rounded-lg text-sm font-medium transition-colors"
              >
                提交评估
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {allCompanyEvals.length === 0 ? (
          <Empty
            icon={<ClipboardCheck className="w-12 h-12" />}
            title="暂无评估记录"
            description="完成实习协议后即可对学生进行评估"
          />
        ) : (
          allCompanyEvals.map((evaluation) => (
            <div key={evaluation.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{evaluation.studentName}</h3>
                  <p className="text-sm text-slate-500">
                    评估人：{evaluation.mentorName} · {evaluation.month}
                  </p>
                </div>
                <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium font-dm">
                  {evaluation.overallScore.toFixed(1)} 分
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <StarRating value={evaluation.workAttitude} size="sm" />
                  <div className="text-xs text-slate-500 mt-1">工作态度</div>
                </div>
                <div className="text-center">
                  <StarRating value={evaluation.professionalSkill} size="sm" />
                  <div className="text-xs text-slate-500 mt-1">专业能力</div>
                </div>
                <div className="text-center">
                  <StarRating value={evaluation.teamwork} size="sm" />
                  <div className="text-xs text-slate-500 mt-1">团队协作</div>
                </div>
                <div className="text-center">
                  <StarRating value={evaluation.initiative} size="sm" />
                  <div className="text-xs text-slate-500 mt-1">主动性</div>
                </div>
              </div>

              <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-3">{evaluation.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
