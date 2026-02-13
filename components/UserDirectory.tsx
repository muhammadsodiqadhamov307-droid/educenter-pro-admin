
import React, { useState, useMemo } from 'react';
import { Search, Filter, Phone, Mail, MoreHorizontal, Download, X, Plus, User as UserIcon, Send, Clock } from 'lucide-react';
import { Role, User, UserStatus, StudyTime, Course, Group } from '../types';

interface UserDirectoryProps {
  role: Role;
  users: User[];
  courses: Course[];
  groups: Group[];
  onAddUser: (user: Omit<User, 'id' | 'joinedAt'>) => void;
}

const UserDirectory: React.FC<UserDirectoryProps> = ({ role, users, courses, groups, onAddUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'ALL'>('ALL');
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    telegram: '',
    preferredTime: 'MORNING' as StudyTime,
    specialty: '',
    status: 'ACTIVE' as UserStatus,
    courseId: '',
    groupId: ''
  });

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.role === role &&
      (statusFilter === 'ALL' || user.status === statusFilter) &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [role, users, searchTerm, statusFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser = {
      ...formData,
      role,
    };
    onAddUser(newUser);
    setShowForm(false);
    setFormData({
      name: '', phone: '', email: '', telegram: '', preferredTime: 'MORNING',
      specialty: '', status: 'ACTIVE', courseId: '', groupId: ''
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{role === 'STUDENT' ? 'Talabalar' : "O'qituvchilar"}</h2>
          <p className="text-slate-500 text-sm mt-1">Ro'yxatdan o'tgan barcha {role === 'STUDENT' ? 'talabalarni' : "o'qituvchilarni"} boshqarish</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            <Download size={18} />
            Eksport
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md"
          >
            <Plus size={18} />
            Yangi qo'shish
          </button>
        </div>
      </div>

      {/* Stats Toggles for Students */}
      {role === 'STUDENT' && (
        <div className="flex flex-wrap gap-2 p-1 bg-slate-100 w-fit rounded-xl border border-slate-200">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${statusFilter === 'ALL' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setStatusFilter('ACTIVE')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${statusFilter === 'ACTIVE' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Faol
          </button>
          <button
            onClick={() => setStatusFilter('DRAFT')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${statusFilter === 'DRAFT' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Qoralama
          </button>
        </div>
      )}

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Qidiruv..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
              <tr>
                <th className="px-6 py-4">F.I.SH</th>
                <th className="px-6 py-4">Kontakt va Telegram</th>
                <th className="px-6 py-4">Dars vaqti</th>
                <th className="px-6 py-4">Holat</th>
                <th className="px-6 py-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                        {user.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-xs text-slate-600">
                      <p className="flex items-center gap-2"><Phone size={12} className="text-slate-400" />{user.phone}</p>
                      {user.telegram && <p className="flex items-center gap-2 text-indigo-500"><Send size={12} />{user.telegram}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.preferredTime && (
                      <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        {user.preferredTime === 'MORNING' ? 'Ertalab' : user.preferredTime === 'AFTERNOON' ? 'Tushdan keyin' : 'Kechqurun'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                      {user.status === 'ACTIVE' ? 'Faol' : 'Qoralama'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">Hech narsa topilmadi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h3 className="text-xl font-bold text-slate-900">Yangi {role === 'STUDENT' ? 'talaba' : "o'qituvchi"} qo'shish</h3>
              <button onClick={() => setShowForm(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">F.I.SH</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="To'liq ism familiya..." value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telefon</label>
                  <input required type="tel" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="+998..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Telegram (username)</label>
                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input type="text" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all" placeholder="@username" value={formData.telegram} onChange={e => setFormData({ ...formData, telegram: e.target.value })} />
                  </div>
                </div>
              </div>

              {role === 'STUDENT' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Dars vaqti oralig'i</label>
                      <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.preferredTime} onChange={e => setFormData({ ...formData, preferredTime: e.target.value as StudyTime })}>
                        <option value="MORNING">Ertalab (9:00 - 13:00)</option>
                        <option value="AFTERNOON">Tushdan keyin (14:00 - 18:00)</option>
                        <option value="EVENING">Kechqurun (18:00 - 21:00)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Holat</label>
                      <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value as UserStatus })}>
                        <option value="ACTIVE">Faol</option>
                        <option value="DRAFT">Qoralama (Navbatda)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Kursni tanlang</label>
                      <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.courseId} onChange={e => setFormData({ ...formData, courseId: e.target.value })}>
                        <option value="">Tanlang...</option>
                        {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-1">Guruhni tanlang</label>
                      <select className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" value={formData.groupId} onChange={e => setFormData({ ...formData, groupId: e.target.value })}>
                        <option value="">Tanlang...</option>
                        {groups.filter(g => !formData.courseId || g.courseId === formData.courseId).map(g => (
                          <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              {role === 'TEACHER' && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mutaxassislik</label>
                  <input required type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Masalan: Ingliz tili" value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })} />
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex gap-3 sticky bottom-0 bg-white">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Bekor qilish</button>
                <button type="submit" className="flex-[2] bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">Ma'lumotlarni saqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDirectory;
