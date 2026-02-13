
import React, { useState } from 'react';
import { Bot, Terminal, Copy, Check, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

const BotPromptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [requirements, setRequirements] = useState(
    "Ro'yxatdan o'tish uchun Telegram bot va unga mos Node.js backendini yarat. Bot ism, rol (talaba/o'qituvchi) va telefon raqamini so'rashi kerak. Ma'lumotlarni PostgreSQL-da saqlash. Dashboard uchun backendda JWT autentifikatsiya bo'lishi lozim."
  );

  const handleGenerate = async () => {
    setLoading(true);
    const result = await api.generateBotPrompt(requirements);
    setPrompt(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-4 px-4">
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl shadow-indigo-100">
          <Bot className="text-white" size={32} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">AI Koder Promt Studiyasi</h2>
        <p className="text-slate-500 max-w-xl mx-auto text-sm sm:text-base">
          Backend va Telegram botni yaratishda yordam kerakmi? Gemini yordamida AI koderlari uchun batafsil texnik promt yarating.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-8 shadow-sm mx-2">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest">
            Maxsus Talablar
          </label>
          <textarea
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
            className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 transition-all resize-none text-slate-600 leading-relaxed outline-none"
            placeholder="Bot va backend uchun talablaringizni yozing..."
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Sparkles size={24} />
                Dasturchi promtini yaratish
              </>
            )}
          </button>
        </div>

        {prompt && (
          <div className="mt-12 space-y-4 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-600 font-bold uppercase tracking-widest text-xs">
                <Terminal size={16} />
                Natija
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all text-xs font-semibold"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                {copied ? 'Nusxalandi' : 'Nusxa olish'}
              </button>
            </div>
            <div className="relative">
              <pre className="p-6 bg-slate-900 text-indigo-100 rounded-2xl text-xs sm:text-sm font-mono overflow-x-auto max-h-[500px] whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-800">
                {prompt}
              </pre>
            </div>
            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl text-sm">
              <AlertCircle size={20} className="flex-shrink-0" />
              <p>
                <strong>Tavsiya:</strong> Ushbu promtni <strong>Windsurf</strong> yoki <strong>Cursor</strong> kabi vositalarga nusxalab o'tkazing. U tizimni bir necha daqiqada qurish uchun barcha texnik detallarni o'z ichiga oladi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BotPromptGenerator;
