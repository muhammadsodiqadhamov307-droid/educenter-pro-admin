
export type Role = 'STUDENT' | 'TEACHER';
export type UserStatus = 'ACTIVE' | 'DRAFT';
export type StudyTime = 'MORNING' | 'AFTERNOON' | 'EVENING';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  telegram?: string;
  preferredTime?: StudyTime;
  role: Role;
  joinedAt: string;
  status: UserStatus;
  specialty?: string; // For teachers
  courseId?: string; // Associated course
  groupId?: string; // Associated group
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
}

export interface Group {
  id: string;
  name: string;
  courseId: string;
  teacherId: string;
  studentIds: string[];
  schedule: string;
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeGroups: number;
  activeCourses: number;
}
