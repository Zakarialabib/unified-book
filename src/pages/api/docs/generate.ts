import { getCollection } from 'astro:content';

export async function GET({ url }) {
  const collection = url.searchParams.get('collection') || 'all';
  const format = url.searchParams.get('format') || 'html';

  const collections = ['astro', 'svelte', 'rust'] as const;
  let entries: Awaited<ReturnType<typeof getCollection>>[] = [];

  if (collection === 'all') {
    for (const coll of collections) {
      entries.push(await getCollection(coll));
    }
  } else {
    entries.push(await getCollection(collection as string));
  }

  const allChapters = entries.flat().sort((a, b) => a.data.order - b.data.order);

  if (format === 'markdown') {
    let md = `# ${allChapters[0]?.series || 'Unified Book'} — Documentation\n\n`;
    md += `> Auto-generated educational documentation for clients\n\n`;
    md += `---\n\n`;
    for (const chapter of allChapters) {
      md += `## ${chapter.data.title}\n\n`;
      md += `${chapter.data.description}\n\n`;
      md += `**Series:** ${chapter.data.series} | **Level:** ${chapter.data.level}\n\n`;
      md += `${chapter.body}\n\n`;
      md += `---\n\n`;
    }
    return new Response(JSON.stringify({ content: md }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${allChapters[0]?.series || 'Documentation'}</title>`;
  const accent = allChapters[0]?.color || '#5628b4';
  html += `<style>body{font-family:Georgia,serif;max-width:74rem;margin:0 auto;padding:2rem;line-height:1.8;color:#221c12;}h1{color:${accent};}h2{color:${accent};margin-top:2rem;}pre{background:#f2ead6;padding:1rem;border-radius:8px;overflow-x:auto;}code{font-family:JetBrains Mono,monospace;}</style>`;
  html += '</head><body>';
  html += `<h1>${allChapters[0]?.series || 'Documentation'}</h1>`;
  html += `<p>Auto-generated educational documentation for clients</p>`;
  for (const chapter of allChapters) {
    html += `<div class="chapter"><h2>${chapter.data.title}</h2>`;
    html += `<p><em>${chapter.data.description}</em></p>`;
    html += `<p><strong>Series:</strong> ${chapter.data.series} | <strong>Level:</strong> ${chapter.data.level}</p>`;
    html += chapter.body.replace(/```[\s\S]*?```/g, '').substring(0, 2000) + '...';
    html += '</div><hr>';
  }
  html += '</body></html>';

  return new Response(JSON.stringify({ html }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
