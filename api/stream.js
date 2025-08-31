// api/stream.js  (Vercel Edge)
export default async function (req) {
  const { searchParams } = new URL(req.url);
  const raw = searchParams.get('url');
  if (!raw) return new Response('Falta url', { status: 400 });

  const upstream = await fetch(raw, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      referer: 'https://topembed.pw/',
      origin: 'https://topembed.pw'
    },
    // Si el servidor usa cookies / redirecciones, las seguimos
    redirect: 'follow'
  });

  // Si el servidor devuelve 403/404 mostramos el error para depurar
  if (!upstream.ok) {
    return new Response(await upstream.text(), { status: upstream.status });
  }

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache',
      'Content-Type': upstream.headers.get('Content-Type') || 'application/vnd.apple.mpegurl'
    }
  });
}
