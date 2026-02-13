
import { User, Course, Group, Role } from '../types';

const API_URL = '/api';

export const api = {
    // Users
    getUsers: async (role?: Role): Promise<User[]> => {
        const query = role ? `?role=${role}` : '';
        const res = await fetch(`${API_URL}/users${query}`);
        if (!res.ok) throw new Error('Failed to fetch users');
        return res.json();
    },

    createUser: async (user: Omit<User, 'id' | 'joinedAt'>): Promise<User> => {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });
        if (!res.ok) throw new Error('Failed to create user');
        return res.json();
    },

    // Courses
    getCourses: async (): Promise<Course[]> => {
        const res = await fetch(`${API_URL}/courses`);
        if (!res.ok) throw new Error('Failed to fetch courses');
        return res.json();
    },

    createCourse: async (course: Omit<Course, 'id'>): Promise<Course> => {
        const res = await fetch(`${API_URL}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(course),
        });
        if (!res.ok) throw new Error('Failed to create course');
        return res.json();
    },

    // Groups
    getGroups: async (): Promise<Group[]> => {
        const res = await fetch(`${API_URL}/groups`);
        if (!res.ok) throw new Error('Failed to fetch groups');
        return res.json();
    },

    createGroup: async (group: Omit<Group, 'id'>): Promise<Group> => {
        const res = await fetch(`${API_URL}/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(group),
        });
        if (!res.ok) throw new Error('Failed to create group');
        return res.json();
    },

    // AI
    generateCourseDescription: async (courseTitle: string): Promise<string> => {
        const res = await fetch(`${API_URL}/ai/generate-description`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ courseTitle }),
        });
        if (!res.ok) throw new Error('Failed to generate description');
        const data = await res.json();
        return data.text;
    },

    generateBotPrompt: async (requirements: string): Promise<string> => {
        const res = await fetch(`${API_URL}/ai/generate-prompt`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ requirements }),
        });
        if (!res.ok) throw new Error('Failed to generate prompt');
        const data = await res.json();
        return data.text;
    }
};
