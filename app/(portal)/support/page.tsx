'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  LifeBuoy,
  ShieldAlert,
  Laptop,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { NeoCard } from '@/components/neumorphic/NeoCard';
import { NeoButton } from '@/components/neumorphic/NeoButton';
import { NeoInput } from '@/components/neumorphic/NeoInput';
import { NeoModal } from '@/components/neumorphic/NeoModal';
import { initialAIMessages, initialDevices } from '@/lib/store';
import { AIConversationMessage } from '@/lib/types';

export default function SupportAndAIPage() {
  const [messages, setMessages] = useState<AIConversationMessage[]>(initialAIMessages);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  // Ticket Modal State
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketCategory, setTicketCategory] = useState<'general' | 'pairing' | 'remote_lock' | 'security_alert'>('general');
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrompt.trim() || isThinking) return;

    const userText = inputPrompt.trim();
    setInputPrompt('');

    const newMsg: AIConversationMessage = {
      id: `msg_${Date.now()}`,
      user_id: 'usr_sandeep_01',
      role: 'user',
      content: userText,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setIsThinking(true);

    // AI Sandboxed Response Generator (Safe, zero-privilege explanation assistant)
    setTimeout(() => {
      let replyContent = `I can help explain your LockPulse security setup. Your registered devices (${initialDevices.map(d => d.device_name).join(', ')}) are currently protected via Ed25519 cryptographic channels.`;

      const lower = userText.toLowerCase();
      if (lower.includes('lock') || lower.includes('remote')) {
        replyContent = `LockPulse triggers native OS lock commands (LockWorkStation on Windows, SACLockScreenImmediate on macOS). These commands are time-bound with a 30-second cryptographic nonce to prevent replay attacks.`;
      } else if (lower.includes('was this you') || lower.includes('suspicious') || lower.includes('away')) {
        replyContent = `The "Was This You?" feature monitors device proximity. When a laptop is unlocked while your phone is determined to be away, LockPulse flags an elevated risk score and prompts you with options to immediately lock down or verify legitimacy.`;
      } else if (lower.includes('ticket') || lower.includes('support') || lower.includes('human')) {
        replyContent = `You can submit a diagnostic ticket using the "Open Support Ticket" button above. LockPulse will automatically attach sanitized device versions without exposing passwords or private keys.`;
      } else if (lower.includes('password') || lower.includes('key')) {
        replyContent = `LockPulse follows zero-trust boundaries: raw OS passwords and private cryptographic keys never leave your laptop's secure storage (DPAPI/Keychain) and are never stored on Supabase servers.`;
      }

      const assistantMsg: AIConversationMessage = {
        id: `msg_ai_${Date.now()}`,
        user_id: 'usr_sandeep_01',
        role: 'assistant',
        content: replyContent,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
    }, 1000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setTicketSubmitted(true);
    setTimeout(() => {
      setTicketSubmitted(false);
      setShowTicketModal(false);
      setTicketSubject('');
      setTicketDescription('');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pulse-blue/10 text-pulse-blue font-heading text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Sandboxed AI Security Companion
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white">
            AI Assistant & Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            Ask security questions, troubleshoot laptop connection issues, or open a support ticket.
          </p>
        </div>

        <NeoButton
          variant="secondary"
          size="sm"
          onClick={() => setShowTicketModal(true)}
          leftIcon={<LifeBuoy className="w-4 h-4 text-pulse-blue" />}
        >
          Open Support Ticket
        </NeoButton>
      </div>

      {/* Main AI Chat Interface */}
      <NeoCard variant="raised" className="p-6 flex flex-col h-[520px]">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-pulse-blue text-white shadow-glow-accent'
                      : 'bg-[#E0E8F2] dark:bg-[#0E1628] text-pulse-blue shadow-neo-sm'
                  }`}
                >
                  {isUser ? 'You' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-pulse-blue to-pulse-cyan text-white shadow-neo-sm font-medium'
                      : 'bg-[#E5ECF4]/80 dark:bg-[#0D1524] text-slate-800 dark:text-slate-200 shadow-neo-pressed border border-slate-300/40 dark:border-white/5'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#E0E8F2] dark:bg-[#0E1628] text-pulse-blue shadow-neo-sm flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-[#E5ECF4]/80 dark:bg-[#0D1524] rounded-2xl text-xs text-slate-500 shadow-neo-pressed">
                Analyzing security telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-3 border-t border-slate-300/40 dark:border-white/10">
          <div className="flex-1">
            <NeoInput
              placeholder="Ask about suspicious unlocks, remote lock, or pairing..."
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              disabled={isThinking}
            />
          </div>
          <NeoButton
            variant="primary"
            size="md"
            type="submit"
            disabled={!inputPrompt.trim() || isThinking}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Send
          </NeoButton>
        </form>
      </NeoCard>

      {/* Support Ticket Modal */}
      <NeoModal
        isOpen={showTicketModal}
        onClose={() => setShowTicketModal(false)}
        title="Create Diagnostic Support Ticket"
        subtitle="Sanitized diagnostics will be attached automatically"
      >
        {ticketSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Ticket Submitted Successfully
            </h4>
            <p className="text-xs text-slate-500">
              Reference #LP-TKT-8924. Our security support team will contact you via your registered email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <NeoInput
                label="Ticket Subject"
                placeholder="e.g. Remote lock delay on Windows 11"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
              />
            </div>

            <div>
              <label className="font-heading font-medium text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e: any) => setTicketCategory(e.target.value)}
                className="w-full bg-[#E5ECF4] dark:bg-[#0E1628] text-slate-800 dark:text-slate-100 rounded-xl px-4 py-3 text-sm shadow-neo-pressed border border-slate-300/40 dark:border-white/5 outline-none"
              >
                <option value="general">General Question</option>
                <option value="pairing">Device Pairing & QR</option>
                <option value="remote_lock">Remote Lock Execution</option>
                <option value="security_alert">Suspicious Alert Inquiry</option>
              </select>
            </div>

            <div>
              <label className="font-heading font-medium text-xs text-slate-700 dark:text-slate-300 uppercase tracking-wider block mb-1.5">
                Problem Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe what happened..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full bg-[#E5ECF4] dark:bg-[#0E1628] text-slate-800 dark:text-slate-100 rounded-xl p-3 text-xs shadow-neo-pressed border border-slate-300/40 dark:border-white/5 outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl text-[11px] text-slate-500 flex items-start gap-2">
              <FileText className="w-4 h-4 text-pulse-blue flex-shrink-0 mt-0.5" />
              <span>
                <strong>Zero Privacy Leakage:</strong> No passwords, session tokens, or private keys are ever included in support tickets.
              </span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <NeoButton variant="ghost" size="sm" type="button" onClick={() => setShowTicketModal(false)}>
                Cancel
              </NeoButton>
              <NeoButton variant="primary" size="md" type="submit">
                Submit Ticket
              </NeoButton>
            </div>
          </form>
        )}
      </NeoModal>
    </div>
  );
}
