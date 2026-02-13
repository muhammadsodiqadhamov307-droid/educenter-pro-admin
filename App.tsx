
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  Layers,
  Menu,
  X,
  Bot,
  Search,
  Plus
} from 'lucide-react';

import Dashboard from './components/Dashboard';
import UserDirectory from './components/UserDirectory';
import CourseManagement from './components/CourseManagement';
import GroupManagement from './components/GroupManagement';
import BotPromptGenerator from './components/BotPromptGenerator';
import { User, Course, Group } from './types';
import { api } from './services/api';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: { to: string, icon: any, label: string, active: boolean, onClick?: () => void }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
        : 'text-slate-500 hover:bg-slate-100 hover:text-indigo-600'
      }`}
  >
    <Icon size={20} className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`} />
    <span className="font-medium">{label}</span>
  </Link>
);

const AppContent = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global State
  const [users, setUsers] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, coursesData, groupsData] = await Promise.all([
          api.getUsers(),
          api.getCourses(),
          api.getGroups()
        ]);
        setUsers(usersData);
        setCourses(coursesData);
        setGroups(groupsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  const addUser = async (user: Omit<User, 'id' | 'joinedAt'>) => {
    try {
      const newUser = await api.createUser(user);
      setUsers(prev => [...prev, newUser]);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      const newCourse = await api.createCourse(course);
      setCourses(prev => [...prev, newCourse]);
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const addGroup = async (group: Omit<Group, 'id'>) => {
    try {
      const newGroup = await api.createGroup(group);
      setGroups(prev => [...prev, newGroup]);
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 relative overflow-x-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out transform lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-8 mt-2 px-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-indigo-200 shadow-lg">
                <BookOpen className="text-white" size={24} />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">EduCenter Pro</h1>
            </div>
            <button onClick={closeSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            <SidebarItem to="/" icon={LayoutDashboard} label="Boshqaruv paneli" active={location.pathname === '/'} onClick={closeSidebar} />
            <SidebarItem to="/students" icon={Users} label="Talabalar" active={location.pathname === '/students'} onClick={closeSidebar} />
            <SidebarItem to="/teachers" icon={UserSquare2} label="O'qituvchilar" active={location.pathname === '/teachers'} onClick={closeSidebar} />
            <SidebarItem to="/courses" icon={BookOpen} label="Kurslar" active={location.pathname === '/courses'} onClick={closeSidebar} />
            <SidebarItem to="/groups" icon={Layers} label="Guruhlar" active={location.pathname === '/groups'} onClick={closeSidebar} />
            <div className="pt-4 mt-4 border-t border-slate-100">
              <SidebarItem to="/ai-helper" icon={Bot} label="AI Koder Prompti" active={location.pathname === '/ai-helper'} onClick={closeSidebar} />
            </div>
          </nav>

          <div className="mt-auto p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100" alt="Admin" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-slate-900 truncate">Admin Foydalanuvchi</p>
                <p className="text-xs text-slate-500 truncate">admin@educenter.uz</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0">
            <Menu size={20} />
          </button>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Qidiruv..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all shadow-md">
              <Plus size={18} />
              Tezkor qo'shish
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard users={users} courses={courses} groups={groups} />} />
              <Route path="/students" element={<UserDirectory role="STUDENT" users={users} courses={courses} groups={groups} onAddUser={addUser} />} />
              <Route path="/teachers" element={<UserDirectory role="TEACHER" users={users} courses={courses} groups={groups} onAddUser={addUser} />} />
              <Route path="/courses" element={<CourseManagement courses={courses} onAddCourse={addCourse} />} />
              <Route path="/groups" element={<GroupManagement groups={groups} users={users} onAddGroup={addGroup} />} />
              <Route path="/ai-helper" element={<BotPromptGenerator />} />
            </Routes>
          </div>
        </div>
      </main>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
