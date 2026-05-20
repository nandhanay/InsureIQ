import React, { useState, useRef, useEffect } from 'react'
import { X, Send, Sparkles, MessageCircle } from 'lucide-react'
import GlassCard from '../../components/ui/GlassCard'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const QUICK_ACTIONS = [
  'What is co-pay?',
  'Explain waiting period',
  'Why was Diabetes Safe recommended?',
  'Compare room rent caps',
  'What does CSR mean?',
]

const MOCK_RESPONSES: Record<string, string> = {
  'What is co-pay?': 'Co-pay is a cost-sharing mechanism where you pay a fixed percentage of the claim amount out of your pocket. For example, if your plan has a 10% co-pay and the hospital bill is ₹1,00,000, you would pay ₹10,000 and the insurer covers ₹90,000. Plans with co-pay generally have lower premiums but higher out-of-pocket expenses during claims.',
  'Explain waiting period': 'A waiting period is the duration after purchasing a policy during which certain conditions are not covered. There are three types: 1) Initial waiting period (usually 30 days) — no claims except accidents. 2) Specific disease waiting period (1-2 years) — conditions like hernia, cataracts. 3) Pre-existing disease (PED) waiting period (2-4 years) — conditions you had before buying the policy. Your pre-diabetes and hypertension would fall under PED waiting period.',
  'Why was Diabetes Safe recommended?': 'Diabetes Safe was ranked #1 for your profile because: 1) It\'s specifically designed for pre-diabetic/diabetic individuals, matching your HbA1c of 6.2%. 2) It has the shortest PED waiting period (1 year vs 2-4 years for others). 3) It covers diabetic emergencies from Day 1. 4) It includes diabetes management programs (HbA1c monitoring, nutritionist). 5) Star Health has a high CSR of 72%. The 10% co-pay on diabetes claims is the main trade-off.',
  'Compare room rent caps': 'Here\'s how your shortlisted plans handle room rent: • Diabetes Safe — No cap (any room). • Star Comprehensive — No cap (single private AC room). • Care Supreme — No cap. • Activ Health Platinum — No cap. • iHealth Plus — No cap up to ₹10L sum insured. Room rent caps can significantly impact claims — if your room costs ₹8,000/day but the cap is ₹5,000/day, all associated costs (surgery, anesthesia) get proportionally reduced.',
  'What does CSR mean?': 'CSR stands for Claim Settlement Ratio — the percentage of claims an insurer settles out of total claims received in a year. A higher CSR means better claim approval rates. Among your recommendations: Star Health (72%), Bajaj Allianz (70%), Care Health (61%), Aditya Birla (58%). Industry average is around 65%. CSR above 70% is considered good.',
}

interface CopilotDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CopilotDrawer({ isOpen, onClose }: CopilotDrawerProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your InsurIQ Copilot. Ask me anything about your recommendations, plan features, or insurance concepts.' },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const messagesEnd = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setInput('')
    setTyping(true)

    // Simulate response
    setTimeout(() => {
      const response = MOCK_RESPONSES[text] || `That's a great question about "${text}". In a full deployment, this would be answered by Claude AI using your specific profile data, plan details, and insurance knowledge base. The response would be personalized to your pre-diabetic profile and shortlisted plans.`
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setTyping(false)
    }, 1200)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 animate-slide-in-right flex flex-col bg-[#0A0A0A] border-l border-white/[0.06]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white/50" />
            <h2 className="text-[16px] font-medium text-white">AI Copilot</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/[0.06] transition-colors">
            <X className="w-5 h-5 text-white/40" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[85%] px-4 py-3 rounded-[var(--radius-md)] text-[13px] leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black'
                    : 'bg-white/[0.06] text-white/70 border border-white/[0.06]'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-[var(--radius-md)] bg-white/[0.06] border border-white/[0.06]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" />
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 rounded-full bg-white/30 animate-pulse" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEnd} />
        </div>

        {/* Quick actions */}
        <div className="px-5 py-3 border-t border-white/[0.04]">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {QUICK_ACTIONS.map((action, i) => (
              <button
                key={i}
                onClick={() => sendMessage(action)}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] text-white/40 bg-white/[0.04] border border-white/[0.06] hover:text-white/60 hover:bg-white/[0.06] transition-all whitespace-nowrap"
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about your plans..."
              className="flex-1 px-4 py-3 rounded-[var(--radius-md)] bg-white/[0.04] border border-white/[0.08] text-white text-[13px] placeholder:text-white/20 focus:outline-none focus:border-white/20"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="p-3 rounded-[var(--radius-md)] bg-white text-black disabled:opacity-30 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
