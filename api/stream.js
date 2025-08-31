export const config = { runtime: 'edge' };

export default async function (req) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get('url');
    if (!raw) return new Response('Falta url', { status: 400 });

    const res = await globalThis.fetch(raw, {
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        referer: 'https://topembed.pw/',
        origin: 'https://topembed.pw'
      },
      redirect: 'follow'
    });

    if (!res.ok) {
      return new Response(
        `Upstream error: ${res.status} ${res.statusText}`,
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
    return new Response(`Crash: ${err.message}`, { status: 500 });
  }
}
