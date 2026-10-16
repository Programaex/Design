import type { Metadata } from 'next';
import { Suspense } from 'react';
import { StoryboardRender } from '@/components/landing/StoryboardRender';

export const metadata: Metadata = { title: 'Storyboard 1920 × 1080', robots: { index: false } };

export default function StoryboardRenderPage() {
	return (
		<Suspense>
			<StoryboardRender />
		</Suspense>
	);
}
