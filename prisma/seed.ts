import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';

// Use pg adapter for direct TCP connection
const directUrl = process.env.DIRECT_DATABASE_URL!;
const pool = new pg.Pool({ connectionString: directUrl });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Seeding database...\n');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@hinduconnect.org' },
        update: {},
        create: {
            name: 'Admin',
            email: 'admin@hinduconnect.org',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });
    console.log(`✅ Admin user: ${admin.email} (password: admin123)`);

    // Seed alumni
    const alumniData = [
        {
            name: 'Aarav Sharma',
            email: 'aarav.sharma@example.com',
            course: 'B.Tech Computer Science',
            graduationYear: 2018,
            currentRole: 'Senior Software Engineer',
            company: 'Google',
            domain: 'Technology',
            location: 'Bangalore, India',
            summary: 'Full-stack engineer specializing in distributed systems and cloud architecture. Passionate about mentoring students transitioning into the tech industry.',
            linkedin: 'https://linkedin.com/in/aaravsharma',
            image: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&h=400&fit=crop',
        },
        {
            name: 'Priya Patel',
            email: 'priya.patel@example.com',
            course: 'MBA Finance',
            graduationYear: 2019,
            currentRole: 'Investment Banking Analyst',
            company: 'Goldman Sachs',
            domain: 'Finance',
            location: 'Mumbai, India',
            summary: 'Experienced in mergers & acquisitions and equity research. Keen to help students break into investment banking.',
            linkedin: 'https://linkedin.com/in/priyapatel',
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
        },
        {
            name: 'Rohan Mehta',
            email: 'rohan.mehta@example.com',
            course: 'B.Tech Mechanical Engineering',
            graduationYear: 2017,
            currentRole: 'Product Manager',
            company: 'Microsoft',
            domain: 'Technology',
            location: 'Hyderabad, India',
            summary: 'Transitioned from engineering to product management. Enthusiastic about helping students explore non-linear career paths.',
            linkedin: 'https://linkedin.com/in/rohanmehta',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        },
        {
            name: 'Ananya Gupta',
            email: 'ananya.gupta@example.com',
            course: 'B.Tech Computer Science',
            graduationYear: 2020,
            currentRole: 'Data Scientist',
            company: 'Amazon',
            domain: 'Data Science',
            location: 'Seattle, USA',
            summary: 'Working on machine learning models for personalization. Open to mentoring students interested in AI/ML careers.',
            linkedin: 'https://linkedin.com/in/ananyagupta',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        },
        {
            name: 'Vikram Singh',
            email: 'vikram.singh@example.com',
            course: 'B.Tech Civil Engineering',
            graduationYear: 2016,
            currentRole: 'Co-Founder & CEO',
            company: 'BuildRight Technologies',
            domain: 'Startup',
            location: 'Delhi, India',
            summary: 'Founded an EdTech startup after 3 years in construction management. Happy to share entrepreneurship insights.',
            linkedin: 'https://linkedin.com/in/vikramsingh',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
        },
        {
            name: 'Neha Reddy',
            email: 'neha.reddy@example.com',
            course: 'MA Economics',
            graduationYear: 2021,
            currentRole: 'Research Analyst',
            company: 'Reserve Bank of India',
            domain: 'Economics',
            location: 'Mumbai, India',
            summary: 'Policy research in monetary economics and financial regulation. Interested in guiding students for government and public sector roles.',
            linkedin: 'https://linkedin.com/in/nehareddy',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        },
        {
            name: 'Arjun Nair',
            email: 'arjun.nair@example.com',
            course: 'B.Tech Electronics',
            graduationYear: 2019,
            currentRole: 'UX Design Lead',
            company: 'Flipkart',
            domain: 'Design',
            location: 'Bangalore, India',
            summary: 'Leading design systems at Flipkart. Pivoted from electronics to UX design. Loves helping students discover design careers.',
            linkedin: 'https://linkedin.com/in/arjunnair',
            image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
        },
        {
            name: 'Kavya Iyer',
            email: 'kavya.iyer@example.com',
            course: 'B.Tech Computer Science',
            graduationYear: 2022,
            currentRole: 'Software Engineer',
            company: 'Stripe',
            domain: 'FinTech',
            location: 'San Francisco, USA',
            summary: 'Building payment infrastructure at Stripe. Active in open-source communities and happy to mentor on tech interviews.',
            linkedin: 'https://linkedin.com/in/kavyaiyer',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
        },
        {
            name: 'Siddharth Joshi',
            email: 'siddharth.joshi@example.com',
            course: 'MBA Marketing',
            graduationYear: 2020,
            currentRole: 'Brand Strategy Manager',
            company: 'Unilever',
            domain: 'Marketing',
            location: 'Mumbai, India',
            summary: 'Building brand strategies for FMCG products across South Asia. Eager to guide students into marketing and brand management.',
            linkedin: 'https://linkedin.com/in/siddharthjoshi',
            image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop',
        },
        {
            name: 'Meera Krishnan',
            email: 'meera.krishnan@example.com',
            course: 'B.Tech Biotechnology',
            graduationYear: 2018,
            currentRole: 'Research Scientist',
            company: 'Biocon',
            domain: 'Healthcare',
            location: 'Bangalore, India',
            summary: 'Research in biosimilars and drug development. Passionate about helping students explore biotech and pharmaceutical careers.',
            linkedin: 'https://linkedin.com/in/meerakrishnan',
            image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
        },
        {
            name: 'Rahul Deshmukh',
            email: 'rahul.deshmukh@example.com',
            course: 'B.Tech Computer Science',
            graduationYear: 2015,
            currentRole: 'Engineering Manager',
            company: 'Meta',
            domain: 'Technology',
            location: 'Menlo Park, USA',
            summary: 'Managing teams working on AR/VR technologies. 9+ years in big tech. Open to helping students with career growth strategies.',
            linkedin: 'https://linkedin.com/in/rahuldeshmukh',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        },
        {
            name: 'Divya Saxena',
            email: 'divya.saxena@example.com',
            course: 'LLB',
            graduationYear: 2019,
            currentRole: 'Corporate Lawyer',
            company: 'AZB & Partners',
            domain: 'Legal',
            location: 'New Delhi, India',
            summary: 'Specializing in mergers, acquisitions, and corporate law. Available to mentor students interested in legal careers.',
            linkedin: 'https://linkedin.com/in/divyasaxena',
            image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
        },
    ];

    for (const data of alumniData) {
        const alumni = await prisma.alumni.upsert({
            where: { email: data.email },
            update: data,
            create: data,
        });
        console.log(`✅ Alumni: ${alumni.name} — ${alumni.currentRole} at ${alumni.company}`);
    }

    // Seed some connection requests
    const allAlumni = await prisma.alumni.findMany({ take: 3 });
    if (allAlumni.length > 0) {
        const requestsData = [
            {
                studentName: 'Ravi Kumar',
                studentEmail: 'ravi.kumar@student.edu',
                subject: 'Looking for mentorship in software engineering',
                message: 'Hi! I am a 3rd year CS student and would love to learn about your journey in tech. Can we connect?',
                category: 'MENTORSHIP' as const,
                status: 'PENDING' as const,
                alumniId: allAlumni[0].id,
            },
            {
                studentName: 'Sneha Verma',
                studentEmail: 'sneha.verma@student.edu',
                subject: 'Internship opportunity inquiry',
                message: 'I am interested in an internship at your company. Could you guide me through the application process?',
                category: 'INTERNSHIP' as const,
                status: 'APPROVED' as const,
                alumniId: allAlumni[1]?.id || allAlumni[0].id,
            },
            {
                studentName: 'Amit Chauhan',
                studentEmail: 'amit.chauhan@student.edu',
                subject: 'Career guidance for product management',
                message: 'I am exploring a career switch to product management. Would love your insights on transitioning from engineering.',
                category: 'CAREER_GUIDANCE' as const,
                status: 'PENDING' as const,
                alumniId: allAlumni[2]?.id || allAlumni[0].id,
            },
        ];

        for (const req of requestsData) {
            await prisma.connectionRequest.create({ data: req });
            console.log(`✅ Request: ${req.studentName} → ${req.subject.slice(0, 40)}...`);
        }
    }

    console.log('\n🎉 Seeding complete!');
    console.log('\n📝 Admin login credentials:');
    console.log('   Email: admin@hinduconnect.org');
    console.log('   Password: admin123');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
