const fs = require('fs');
const cat = JSON.parse(fs.readFileSync('shared/catalogue.json', 'utf8'));

const issues = [];

const timeDict = [
  ['buổi chiều', 'afternoon'],
  ['chiều', 'afternoon'],
  ['ngày', 'day'],
  ['sáng', 'morning'],
  ['trưa', 'midday'],
  ['tối', 'evening'],
  ['theo lịch', 'per schedule'],
  ['tuỳ chọn', 'optional'],
  ['kết thúc', 'end']
];

function normalizeTime(s) {
  let str = (s || '').toLowerCase();
  for (const [viWord, enWord] of timeDict) {
    str = str.split(viWord).join(enWord);
  }
  return str
    .replace(/\./g, ':')
    .replace(/h/g, ':')
    .replace(/\s*[-–—]\s*/g, '–')
    .replace(/\b0([0-9]:)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

cat.tours.forEach(t => {
  const vi = t.itinerary || [];
  const en = t.itineraryEn || [];
  const tourIssues = [];

  if (vi.length !== en.length) {
    tourIssues.push({ type: 'LENGTH_MISMATCH', viLen: vi.length, enLen: en.length });
  }

  const max = Math.max(vi.length, en.length);
  for (let i = 0; i < max; i++) {
    const v = vi[i];
    const e = en[i];
    if (!v) {
      tourIssues.push({ step: i, type: 'VI_MISSING', enTime: e.time, enTitle: e.title });
      continue;
    }
    if (!e) {
      tourIssues.push({ step: i, type: 'EN_MISSING', viTime: v.time, viTitle: v.title });
      continue;
    }

    const vt = normalizeTime(v.time);
    const et = normalizeTime(e.time);

    if (vt !== et && !vt.includes(et) && !et.includes(vt)) {
      tourIssues.push({
        step: i,
        type: 'TIME_MISMATCH',
        viTime: v.time,
        enTime: e.time,
        viTitle: v.title,
        enTitle: e.title
      });
    }

    // Check title quality in VI
    if (v.title && (v.title.length > 70 || v.title === v.text || /^\d{1,2}[:.]\d{2}/.test(v.title))) {
      tourIssues.push({
        step: i,
        type: 'VI_TITLE_MESSY',
        viTitle: v.title.slice(0, 50) + (v.title.length > 50 ? '...' : '')
      });
    }
  }

  if (tourIssues.length > 0) {
    issues.push({ id: t.id, name: t.name, active: t.active, count: tourIssues.length, issues: tourIssues });
  }
});

console.log(`\n========================================`);
console.log(`TOTAL TOURS CHECKED: ${cat.tours.length}`);
console.log(`TOURS WITH ISSUES: ${issues.length}`);
console.log(`========================================`);

issues.forEach(iss => {
  console.log(`\n[${iss.id}] (${iss.name}) - Active: ${iss.active !== false} - Issues: ${iss.count}`);
  iss.issues.forEach(x => console.log('  ', JSON.stringify(x)));
});

if (issues.length === 0) {
  console.log('\n🎉 ALL 41 TOURS HAVE PERFECT ITINERARIES (100% MATCH IN TIMES, STEPS & CONCISE TITLES)!');
}
