'use client';

import React, { useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  LifeBuoy,
  CheckCircle2,
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-palette-sand-light dark:bg-[#222020] border border-palette-sand text-palette-charcoal dark:text-palette-sand font-mono text-xs font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" /> Sandboxed AI Security Companion
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-palette-black dark:text-white tracking-wide">
            AI ASSISTANT & SUPPORT
          </h1>
          <p className="text-xs sm:text-sm font-sans text-palette-ash mt-0.5">
            Ask security questions, troubleshoot laptop connection issues, or open a support ticket.
          </p>
        </div>

        <NeoButton
          variant="secondary"
          size="sm"
          onClick={() => setShowTicketModal(true)}
          leftIcon={<LifeBuoy className="w-4 h-4 text-palette-black dark:text-white" />}
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
                      ? 'bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm'
                      : 'bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-charcoal dark:text-palette-sand border border-palette-sand'
                  }`}
                >
                  {isUser ? 'You' : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl max-w-[80%] text-xs font-sans leading-relaxed ${
                    isUser
                      ? 'bg-palette-black dark:bg-palette-white text-white dark:text-palette-black shadow-editorial-sm font-medium'
                      : 'bg-palette-sand-light/60 dark:bg-[#1A1919] text-palette-charcoal dark:text-palette-sand border border-palette-sand dark:border-[#3E3B3A]'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-palette-sand-light dark:bg-[#1E1D1D] text-palette-ash border border-palette-sand flex items-center justify-center">
                <Bot className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3 bg-palette-sand-light/60 dark:bg-[#1A1919] rounded-2xl text-xs font-sans text-palette-ash">
                Analyzing security telemetry...
              </div>
            </div>
          )}
        </div>

        {/* Chat Input Form */}
        <form onSubmit={handleSendMessage} className="flex items-center gap-3 pt-3 border-t border-palette-sand/60 dark:border-[#3E3B3A]">
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
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-heading text-xl text-palette-black dark:text-white tracking-wide">
              TICKET SUBMITTED SUCCESSFULLY
            </h4>
            <p className="text-xs font-sans text-palette-ash">
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
              <label className="font-heading tracking-wider uppercase text-xs text-palette-charcoal dark:text-palette-sand block mb-1.5">
                Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e: any) => setTicketCategory(e.target.value)}
                className="w-full bg-palette-white dark:bg-[#1A1919] text-palette-black dark:text-palette-white rounded-xl px-4 py-3 text-sm border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-inset outline-none"
              >
                <option value="general">General Question</option>
                <option value="pairing">Device Pairing & QR</option>
                <option value="remote_lock">Remote Lock Execution</option>
                <option value="security_alert">Suspicious Alert Inquiry</option>
              </select>
            </div>

            <div>
              <label className="font-heading tracking-wider uppercase text-xs text-palette-charcoal dark:text-palette-sand block mb-1.5">
                Problem Description
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe what happened..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="w-full bg-palette-white dark:bg-[#1A1919] text-palette-black dark:text-palette-white rounded-xl p-3 text-xs font-sans border border-palette-sand dark:border-[#3E3B3A] shadow-editorial-inset outline-none resize-none"
              />
            </div>

            <div className="p-3 bg-palette-sand-light/60 dark:bg-[#141313] rounded-xl text-[11px] font-sans text-palette-ash flex items-start gap-2 border border-palette-sand/60">
              <FileText className="w-4 h-4 text-palette-black dark:text-white flex-shrink-0 mt-0.5" />
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
