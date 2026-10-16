import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

const g = globalThis as unknown as { prisma?: InstanceType<typeof PrismaClient> };

function create() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error('DATABASE_URL não configurada');
	return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

/** One client per process (survives Next.js hot reload in development). */
export function db() {
	if (!g.prisma) g.prisma = create();
	return g.prisma;
}
export type Db = ReturnType<typeof db>;
