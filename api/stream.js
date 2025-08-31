export const config = { runtime: 'edge' };

export default async function (req) {
  try {
    const url = new URL(req.url);
    let raw = url.searchParams.get('url');
    if (!raw) return new Response('Falta ?url=...', { status: 400 });

    // Aseguramos que la URL esté bien formada
    raw = encodeURI(decodeURI(raw));

    const res = await fetch(raw, {
      headers: {
        'user-agent': 'Mozilla/5.0',
        referer: 'https://topembed.pw/',
        origin: 'https://topembed.pw'
      },
      redirect: 'follow'
    });

    if (!res.ok) {
      return new Response(
        `Upstream ${res.status}: ${await res.text()}`.slice(0, 400),
        { status: res.status }
      );
    }

    return new Response(res.body, {
      status: res.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': res.headers.get('Content-Type') || 'application/vnd.apple.mpegurl'
      }
    });

  } catch (err) {
    return new Response(`Crash: ${err.message}`, { status: 500 });
  }
}
