
import React from 'react';
import { Users, UserSquare2, Layers, BookOpen, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { User, Course, Group } from '../types';

interface DashboardProps {
  users: User[];
  courses: Course[];
  groups: Group[];
}

const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
        <Icon size={24} />
      </div>
      <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium bg-emerald-50 px-2 py-1 rounded-lg">
        <TrendingUp size={14} />
        {trend}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ users, courses, groups }) => {
  const students = users.filter(u => u.role === 'STUDENT');
  const teachers = users.filter(u => u.role === 'TEACHER');

  const chartData = [
    { name: 'Dush', talabalar: 5 },
    { name: 'Sesh', talabalar: 8 },
    { name: 'Chor', talabalar: 12 },
    { name: 'Pay', talabalar: 15 },
    { name: 'Jum', talabalar: 10 },
    { name: 'Shan', talabalar: 5 },
    { name: 'Yak', talabalar: 2 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Talabalar" value={students.length} icon={Users} trend="+12%" color="indigo" />
        <StatCard title="O'qituvchilar" value={teachers.length} icon={UserSquare2} trend="+4%" color="blue" />
        <StatCard title="Guruhlar" value={groups.length} icon={Layers} trend="+8%" color="violet" />
        <StatCard title="Kurslar" value={courses.length} icon={BookOpen} trend="+2%" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-lg mb-8">Haftalik o'sish</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="talabalar" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-lg mb-6">Oxirgi a'zolar</h3>
          <div className="space-y-6">
            {users.slice(-5).reverse().map((user, i) => (
              <div key={user.id} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center font-bold text-indigo-600">
                   {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {user.name} 
                    <span className="font-normal text-slate-500"> ({user.role === 'TEACHER' ? "o'qituvchi" : 'talaba'})</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{user.joinedAt}</p>
                </div>
                <ArrowUpRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
