// Vercel Edge Function
export default async function handler(req) {
  const url = new URL(req.url).searchParams.get('url');
  if (!url) return new Response('Falta parámetro url', { status: 400 });

  const upstream = await fetch(url, {
    headers: { referer: 'https://topembed.pw/', 'user-agent': 'Mozilla/5.0' }
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': upstream.headers.get('Content-Type') || 'application/vnd.apple.mpegurl'
    }
  });
}
