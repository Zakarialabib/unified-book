export interface Theme {
  name: string;
  series: string;
  accent: string;
  accentSoft: string;
  bg: string; bg2: string; bg3: string;
  ink: string; ink2: string; ink3: string;
  rule: string; gold: string; green: string;
  isDark: boolean;
}

export const themes: Theme[] = [
  { name:'Ae — Astro Ecosystem', series:'The Astro Ecosystem', accent:'#5628b4', accentSoft:'rgba(86,40,180,0.09)', bg:'#f4ecdb',bg2:'#faf4e5',bg3:'#e9dec4', ink:'#221c12',ink2:'#5a523f',ink3:'#8d8266', rule:'#d2c5a3',gold:'#9c7215',green:'#4a7c3c', isDark:false },
  { name:'Sv — Reactivity with Svelte', series:'Reactivity with Svelte', accent:'#c92907', accentSoft:'rgba(201,41,7,0.09)', bg:'#f4ecdb',bg2:'#faf4e5',bg3:'#e9dec4', ink:'#221c12',ink2:'#5a523f',ink3:'#8d8266', rule:'#d2c5a3',gold:'#9c7215',green:'#4a7c3c', isDark:false },
  { name:'Fe — Systems Programming in Rust', series:'Systems Programming in Rust', accent:'#c92907', accentSoft:'rgba(201,41,7,0.09)', bg:'#f4ecdb',bg2:'#faf4e5',bg3:'#e9dec4', ink:'#221c12',ink2:'#5a523f',ink3:'#8d8266', rule:'#d2c5a3',gold:'#9c7215',green:'#4a7c3c', isDark:false },
  { name:'Dark — Unified', series:'Unified Book', accent:'#b39af0', accentSoft:'rgba(179,154,240,0.12)', bg:'#16120d',bg2:'#1e1913',bg3:'#2a2318', ink:'#e9e0c8',ink2:'#b4a98d',ink3:'#7e7460', rule:'#3c3324',gold:'#c99b3f',green:'#7fa864', isDark:true },
  { name:'Book — Paper', series:'Unified Book', accent:'#7a4c18', accentSoft:'rgba(122,76,24,0.08)', bg:'#fdf6e3',bg2:'#f5ecd7',bg3:'#e8dcc8', ink:'#3b2e1e',ink2:'#6b5a44',ink3:'#9b8a72', rule:'#d9c8a8',gold:'#b5832a',green:'#5a7a3c', isDark:false },
];

export function getThemeCSS(theme: Theme): Record<string,string> {
  return { '--accent':theme.accent,'--accent-soft':theme.accentSoft,'--bg':theme.bg,'--bg-2':theme.bg2,'--bg-3':theme.bg3,'--ink':theme.ink,'--ink-2':theme.ink2,'--ink-3':theme.ink3,'--rule':theme.rule,'--gold':theme.gold,'--green':theme.green };
}
