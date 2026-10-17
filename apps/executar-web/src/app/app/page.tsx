import type { Metadata } from 'next';
import { PrismaApp } from '@/components/app/PrismaApp';

export const metadata: Metadata = { title: 'Prisma', description: 'Seu plano em três horizontes: agora, próximo e depois.' };

export default function AppPage() {
	return <PrismaApp />;
}
