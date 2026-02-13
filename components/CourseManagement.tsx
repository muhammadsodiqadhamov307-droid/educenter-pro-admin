
import React, { useState } from 'react';
import { BookOpen, Sparkles, Clock, Tag, ArrowRight, X } from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';

interface CourseManagementProps {
  courses: Course[];
  onAddCourse: (course: Omit<Course, 'id'>) => void;
}

const CourseManagement: React.FC<CourseManagementProps> = ({ courses, onAddCourse }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', duration: '', category: '' });

  const handleSuggestDescription = async () => {
    if (!formData.title) return;
    setIsGenerating(true);
    try {
      const desc = await api.generateCourseDescription(formData.title);
      setFormData(prev => ({ ...prev, description: desc }));
    } catch (error) {
      console.error("Error generating description:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddCourse({
      ...formData
    });
    setShowForm(false);
    setFormData({ title: '', description: '', duration: '', category: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Kurslar</h2>
          <p className="text-slate-500 text-sm mt-1">O'quv yo'nalishlarini loyihalash va boshqarish</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md transition-all"
        >
          Yangi kurs
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-all flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase">
                {course.category}
              </span>
              <BookOpen size={18} className="text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{course.title}</h3>
            <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-3">{course.description}</p>
            <div className="flex items-center gap-4 border-t border-slate-100 pt-4 mt-auto">
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <Clock size={14} className="text-slate-400" />
                {course.duration}
              </div>
              <button className="ml-auto text-indigo-600 hover:translate-x-1 transition-transform">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Yangi kurs yaratish</h3>
              <button onClick={() => setShowForm(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1">Kurs nomi</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <button type="button" onClick={handleSuggestDescription} className="mt-6 p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 h-fit" disabled={isGenerating}>
                  <Sparkles size={20} className={isGenerating ? 'animate-pulse' : ''} />
                </button>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tavsif (AI taklif qilishi mumkin)</label>
                <textarea required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl h-24" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1">Davomiyligi</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Masalan: 3 oy" value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Kategoriya</label>
                  <input required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl" placeholder="Masalan: IT" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                </div>
              </div>
              <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4">Saqlash</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManagement;
