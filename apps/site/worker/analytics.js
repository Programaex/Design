// Analytics do Worker via GraphQL Analytics API da Cloudflare. Sem token: { connected:false }.
const ANALYTICS_QUERY = `query($account:String!,$script:String!,$since:Time!,$until:Time!){viewer{accounts(filter:{accountTag:$account}){
 workersInvocationsAdaptive(limit:1000,filter:{scriptName:$script,datetime_geq:$since,datetime_leq:$until},orderBy:[date_ASC]){
  sum{requests errors subrequests} dimensions{date} }}}}`;

export async function analytics(env, days = 7, fetcher = fetch) {
	if (!env.CF_ANALYTICS_TOKEN || !env.CF_ACCOUNT_ID) return { connected: false, reason: 'Defina os secrets CF_ANALYTICS_TOKEN e CF_ACCOUNT_ID' };
	const until = new Date(), since = new Date(until.getTime() - days * 864e5);
	const r = await fetcher('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: { authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'content-type': 'application/json' },
		body: JSON.stringify({ query: ANALYTICS_QUERY, variables: { account: env.CF_ACCOUNT_ID, script: env.CF_SCRIPT_NAME || 'design', since: since.toISOString(), until: until.toISOString() } }),
	});
	const data = await r.json().catch(() => ({}));
	if (!r.ok || data.errors?.length) return { connected: true, ok: false, error: data.errors?.[0]?.message || `HTTP ${r.status}` };
	const rows = data.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
	const byDay = {};
	for (const row of rows) {
		const d = row.dimensions.date;
		byDay[d] ??= { date: d, requests: 0, errors: 0 };
		byDay[d].requests += row.sum.requests;
		byDay[d].errors += row.sum.errors;
	}
	const series = Object.values(byDay);
	return { connected: true, ok: true, days, series, totals: series.reduce((t, d) => ({ requests: t.requests + d.requests, errors: t.errors + d.errors }), { requests: 0, errors: 0 }) };
}

