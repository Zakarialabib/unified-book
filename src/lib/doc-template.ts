export interface DocTemplate {
  title: string;
  subtitle: string;
  sections: DocSection[];
}

export interface DocSection {
  heading: string;
  content: string;
  code?: string;
  language?: string;
}

export function generateMarkdownTemplate(chapters: Array<{ title: string; description: string; body: string; series: string }>): string {
  let md = `# ${chapters[0]?.series || 'Unified Book'} — Documentation\n\n`;
  md += `> Auto-generated educational documentation\n\n`;
  md += `---\n\n`;

  for (const chapter of chapters) {
    md += `## ${chapter.title}\n\n`;
    md += `${chapter.description}\n\n`;
    md += `${chapter.body}\n\n`;
    md += `---\n\n`;
  }

  return md;
}

export function generateHTMLTemplate(chapters: Array<{ title: string; description: string; body: string; series: string; color: string }>): string {
  let html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${chapters[0]?.series || 'Documentation'}</title>`;
  html += `<style>body{font-family:Georgia,serif;max-width:74rem;margin:0 auto;padding:2rem;line-height:1.8;color:#221c12;}h1{color:${chapters[0]?.color || '#5628b4'};}h2{color:${chapters[0]?.color || '#c92907'};margin-top:2rem;}pre{background:#f2ead6;padding:1rem;border-radius:8px;overflow-x:auto;}code{font-family:JetBrains Mono,monospace;}</style>`;
  html += '</head><body>';
  html += `<h1>${chapters[0]?.series || 'Documentation'}</h1>`;
  for (const chapter of chapters) {
    html += `<h2>${chapter.title}</h2>`;
    html += `<p><em>${chapter.description}</em></p>`;
    html += `<p><strong>Series:</strong> ${chapter.series}</p>`;
    html += chapter.body.replace(/```[\s\S]*?```/g, '').substring(0, 500) + '...';
    html += '<hr>';
  }
  html += '</body></html>';
  return html;
}
