export const config = { runtime: 'edge' };

export default async function handler(req) {
  const url = new URL(req.url);
  const raw = url.searchParams.get('url');
  if (!raw) return new Response('Falta ?url=...', { status: 400 });

  const res = await fetch(raw, {
    headers: { 'user-agent': 'Mozilla/5.0', referer: new URL(raw).origin },
    redirect: 'follow'
  });

  if (!res.ok) return new Response(`Upstream ${res.status}`, { status: res.status });

  return new Response(res.body, {
    status: res.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': res.headers.get('Content-Type') || 'application/vnd.apple.mpegurl'
    }
  });
}
