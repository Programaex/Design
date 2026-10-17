import catalog from '../../catalog.json';

export type MiniAppDef = (typeof catalog.apps)[number];
export const APPS: MiniAppDef[] = catalog.apps;
export const appBySlug = (slug: string) => APPS.find(a => a.slug === slug)!;
/** Where each mini app is listed in the ecosystem site. */
export const catalogUrl = (a: MiniAppDef) => '/ui_kits/ecossistema/#/' + a.catalog;
export const appUrl = (slug: string) => '/m/' + slug + '/';
/** Apps shown in the bottom switcher (the CSV importer is reached from the Prisma and the empty states). */
export const SWITCHER = ['prisma', 'executar', 'mapa', 'rotinas', 'folhas-a4'];
