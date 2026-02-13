
import React, { useState } from 'react';
import { Layers, Calendar, User, Users as UsersIcon, Plus, X } from 'lucide-react';
import { Group, User as UserType, Course } from '../types';

interface GroupManagementProps {
  groups: Group[];
  users: UserType[];
  onAddGroup: (group: Omit<Group, 'id'>) => void;
}

const GroupManagement: React.FC<GroupManagementProps> = ({ groups, users, onAddGroup }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', teacherId: '', courseId: '', schedule: '' });

  const teachers = users.filter(u => u.role === 'TEACHER');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddGroup({
      ...formData,
      studentIds: []
    });
    setShowForm(false);
    setFormData({ name: '', teacherId: '', courseId: '', schedule: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Guruhlar</h2>
          <p className="text-slate-500 text-sm mt-1">O'quv guruhlarini shakllantirish</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-lg transition-all"
        >
          <Plus size={18} />
          Yangi guruh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {groups.map((group) => {
          const teacher = teachers.find(t => t.id === group.teacherId);
          return (
            <div key={group.id} className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center gap-6 hover:shadow-sm transition-all group">
              <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 hidden sm:block">
                <Layers size={32} />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-bold text-slate-900 text-lg">{group.name}</h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-indigo-400 shrink-0" />
                    <span>O'qituvchi: {teacher?.name || 'Tanlanmagan'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon size={16} className="text-indigo-400 shrink-0" />
                    <span>{group.studentIds.length} talaba</span>
                  </div>
                </div>
              </div>
              <div className="md:w-64 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar size={16} className="text-slate-400" />
                  <span className="text-xs">{group.schedule}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full w-1/4"></div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 rounded-xl">Batafsil</button>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Yangi guruh</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Guruh nomi</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">O'qituvchi</label>
                <select required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.teacherId} onChange={e => setFormData({ ...formData, teacherId: e.target.value })}>
                  <option value="">Tanlang...</option>
                  {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Dars jadvali</label>
                <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Dush-Chor-Jum 18:00" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} />
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4">Saqlash</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupManagement;
