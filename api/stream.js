export const config = { runtime: 'edge' };

export default async function (req) {
  try {
    const url = new URL(req.url);
    const raw = url.searchParams.get('url');
    if (!raw) return new Response('Falta ?url=...', { status: 400 });

    console.log('Proxying:', raw);   // aparecerá en Logs de Vercel

    const res = await fetch(raw, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        referer: 'https://topembed.pw/',
        origin: 'https://topembed.pw'
      },
      redirect: 'follow'
    });

    console.log('Upstream status:', res.status, res.statusText);

    if (!res.ok) {
      const text = await res.text();
      return new Response(
        `Upstream ${res.status}: ${text.slice(0, 300)}`,
        { status: res.status }
      );
    }

    return new Response(res.body, {
      status: res.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Content-Type': res.headers.get('Content-Type') || 'application/vnd.apple.mpegurl'
      }
    });

  } catch (err) {
    return new Response(`Error interno: ${err.message}`, { status: 500 });
  }
}
