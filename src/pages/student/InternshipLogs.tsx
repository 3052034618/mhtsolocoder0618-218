import { useState } from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { useAuthStore } from '@/stores/useAuthStore'
import { useLogStore } from '@/stores/useLogStore'
import { useAgreementStore } from '@/stores/useAgreementStore'
import Empty from '@/components/Empty'
import { cn } from '@/lib/utils'

export default function InternshipLogs() {
  const user = useAuthStore((s) => s.user)
  const getLogsByStudent = useLogStore((s) => s.getLogsByStudent)
  const addLog = useLogStore((s) => s.addLog)
  const getAgreementsByStudent = useAgreementStore((s) => s.getAgreementsByStudent)

  const studentId = user?.id ?? ''
  const logs = getLogsByStudent(studentId)
  const agreements = getAgreementsByStudent(studentId)
  const activeAgreement = agreements.find((a) => a.status === 'completed')

  const [selectedLogId, setSelectedLogId] = useState<string | null>(null)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [content, setContent] = useState('')
  const [harvest, setHarvest] = useState('')

  const selectedLog = logs.find((l) => l.id === selectedLogId)

  const handleSave = () => {
    if (!activeAgreement || !content.trim()) return
    addLog({
      agreementId: activeAgreement.id,
      studentId,
      date,
      content: content.trim(),
      harvest: harvest.trim(),
    })
    setContent('')
    setHarvest('')
  }

  if (!activeAgreement) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
          实习日志
        </h1>
        <Empty
          icon={<BookOpen className="w-12 h-12" />}
          title="暂无实习协议"
          description="完成协议签署后即可开始记录实习日志"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900" style={{ fontFamily: 'Noto Serif SC, serif' }}>
        实习日志
      </h1>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">日志记录</h2>
          {logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">暂无日志</p>
          ) : (
            <div className="relative pl-6">
              <div className="absolute left-[9px] top-2 bottom-2 w-0.5 bg-slate-200" />
              {logs.map((log) => (
                <div key={log.id} className="relative pb-4">
                  <button
                    onClick={() => setSelectedLogId(log.id)}
                    className={cn(
                      'absolute left-[-18px] top-1 h-4 w-4 rounded-full border-2 transition-colors',
                      selectedLogId === log.id
                        ? 'border-teal-700 bg-teal-700'
                        : 'border-slate-300 bg-white hover:border-teal-400'
                    )}
                  />
                  <div
                    onClick={() => setSelectedLogId(log.id)}
                    className={cn(
                      'cursor-pointer rounded-lg border p-3 transition-colors',
                      selectedLogId === log.id
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    )}
                  >
                    <p className="text-xs font-medium text-slate-500">{log.date}</p>
                    <p className="mt-1 text-sm text-slate-700 line-clamp-2">{log.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-3">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {selectedLog ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">{selectedLog.date}</h3>
                  <button
                    onClick={() => setSelectedLogId(null)}
                    className="text-xs text-teal-700 hover:underline"
                  >
                    写新日志
                  </button>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">工作内容</label>
                  <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{selectedLog.content}</p>
                </div>
                {selectedLog.harvest && (
                  <div>
                    <label className="text-sm font-medium text-slate-700">收获与心得</label>
                    <p className="mt-1 text-sm text-slate-600 whitespace-pre-wrap">{selectedLog.harvest}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900">撰写日志</h3>
                <div>
                  <label className="block text-sm font-medium text-slate-700">日期</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">工作内容</label>
                  <textarea
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="描述今天的工作内容..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">收获与心得</label>
                  <textarea
                    rows={3}
                    value={harvest}
                    onChange={(e) => setHarvest(e.target.value)}
                    placeholder="今天的收获和心得..."
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500"
                  />
                </div>
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                  className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors',
                    content.trim()
                      ? 'bg-teal-700 hover:bg-teal-800'
                      : 'bg-slate-300 cursor-not-allowed'
                  )}
                >
                  <Plus className="h-4 w-4" />
                  保存
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
