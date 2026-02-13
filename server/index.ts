
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes

// Users
app.get('/api/users', async (req, res) => {
    try {
        const { role } = req.query;
        const users = await prisma.user.findMany({
            where: role ? { role: role as any } : undefined,
            include: {
                course: true,
                teachingGroups: true,
                groups: true
            }
        });
        // Transform data to match frontend expectations if necessary
        // For now, sending as is.
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        const user = await prisma.user.create({
            data: {
                ...req.body,
                joinedAt: new Date(), // Ensure joinedAt is set
            },
        });
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// Courses
app.get('/api/courses', async (req, res) => {
    try {
        const courses = await prisma.course.findMany();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch courses' });
    }
});

app.post('/api/courses', async (req, res) => {
    try {
        const course = await prisma.course.create({
            data: req.body,
        });
        res.json(course);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create course' });
    }
});

// Groups
app.get('/api/groups', async (req, res) => {
    try {
        const groups = await prisma.group.findMany({
            include: {
                course: true,
                teacher: true,
                students: true
            }
        });

        // Transform for frontend: map students to studentIds if needed, 
        // but better to update frontend to handle populated data or just send necessary fields.
        // The frontend expects `studentIds: string[]`.
        const formattedGroups = groups.map(g => ({
            ...g,
            studentIds: g.students.map(s => s.id)
        }));

        res.json(formattedGroups);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch groups' });
    }
});

app.post('/api/groups', async (req, res) => {
    try {
        const { studentIds, ...rest } = req.body;
        const group = await prisma.group.create({
            data: {
                ...rest,
                students: {
                    connect: studentIds.map((id: string) => ({ id }))
                }
            },
            include: { // Include relations in response to match get structure specificallty
                students: true
            }

        });
        // maintain consistency
        const formattedGroup = {
            ...group,
            studentIds: group.students.map(s => s.id)
        }

        res.json(formattedGroup);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});


// AI Routes
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

app.post('/api/ai/generate-description', async (req, res) => {
    try {
        const { courseTitle } = req.body;
        const ai = getAI();
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `O'quv markazi uchun "${courseTitle}" nomli kurs haqida professional va qiziqarli 2 jumlali tavsif matnini O'ZBEK tilida yarating.`,
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: 'AI generation failed' });
    }
});

app.post('/api/ai/generate-prompt', async (req, res) => {
    try {
        const { requirements } = req.body;
        const ai = getAI();
        // Note: 'thinkingConfig' might not be supported in standard SDK yet or requires specific model
        // Using standard generation for safety unless user has specific preview access.
        // Reverting to standard model for broader compatibility: gemini-2.0-flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: `Siz jahon miqyosidagi senior full-stack muhandissiz. Quyidagi talablar asosida Telegram bot va Express API backendini qurish uchun AI Koder (Cursor yoki Windsurf kabi) uchun juda batafsil texnik promt yozing. Promt ingliz tilida bo'lishi mumkin (dasturlash uchun qulay), lekin tizim o'zbek tilini qo'llab-quvvatlashi kerak. Talablar: ${requirements}. Ma'lumotlar bazasi (PostgreSQL), xavfsizlik va API endpointlar tuzilmasini kiriting.`,
        });
        res.json({ text: response.text });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: 'AI generation failed' });
    }
});


// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
