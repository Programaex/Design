import * as C from '@executar/core';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@executar/ui', () => ({ readSaved: () => null, STORAGE_KEY: 'executar-prisma-v1', usePrismaApp: () => ({}) }));
const { sharedPatch, SHARED } = await import('../src/shell/store');

describe('sharedPatch (sync between mini apps)', () => {
	const { plan, setup } = C.demoPlan('2026-10-16');

	it('takes only the shared plan fields that changed in another tab', () => {
		const other = C.toggleTask(plan, plan.ents[0].tarefas[2].id);
		const patch = sharedPatch({ plan, setup, screen: 'app', tab: 'executar' }, { plan: other, setup, screen: 'wizard', tab: 'prisma', step: 3 });
		expect(Object.keys(patch)).toEqual(['plan']);
		expect(patch.plan).toBe(other);
	});

	it('is empty when only view fields differ, which stops write ping-pong between tabs', () => {
		expect(sharedPatch({ plan, setup, screen: 'app', tab: 'mapa' }, JSON.parse(JSON.stringify({ plan, setup, screen: 'wizard', tab: 'rotinas', sub: 'export' })))).toEqual({});
		expect(sharedPatch({ plan }, null)).toEqual({});
	});

	it('never shares per-app view state', () => {
		expect(SHARED).not.toContain('screen');
		expect(SHARED).not.toContain('tab');
		expect(SHARED).not.toContain('step');
	});
});
