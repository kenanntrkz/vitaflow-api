import pool, { query } from './index';

const templates = [
  {
    name: 'Modern Blue',
    slug: 'modern-blue',
    description: 'Clean, modern design with blue accents. Perfect for tech and corporate roles.',
    is_premium: false,
    sort_order: 1,
    html_css: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; line-height: 1.5; }
  .header { background: #2563eb; color: white; padding: 32px; }
  .header h1 { font-size: 28px; margin-bottom: 4px; }
  .header .subtitle { font-size: 14px; opacity: 0.9; }
  .contact { display: flex; gap: 16px; margin-top: 12px; font-size: 12px; }
  .content { padding: 24px 32px; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 16px; color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 4px; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 1px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; }
  .entry-title { font-weight: 600; }
  .entry-date { color: #666; font-size: 13px; }
  .entry-subtitle { color: #444; font-size: 14px; }
  .entry-desc { font-size: 13px; margin-top: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: #eff6ff; color: #2563eb; padding: 4px 12px; border-radius: 4px; font-size: 13px; }
  .summary { font-size: 14px; color: #333; }
</style>
<div class="header">
  <h1>{{fullName}}</h1>
  <div class="contact">
    {{#email}}<span>{{email}}</span>{{/email}}
    {{#phone}}<span>{{phone}}</span>{{/phone}}
    {{#location}}<span>{{location}}</span>{{/location}}
    {{#linkedin}}<span>{{linkedin}}</span>{{/linkedin}}
  </div>
</div>
<div class="content">
  {{#summary}}<div class="section"><p class="summary">{{summary}}</p></div>{{/summary}}
  {{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-header"><span class="entry-title">{{position}}</span><span class="entry-date">{{startDate}} - {{endDate}}</span></div><div class="entry-subtitle">{{company}}{{#location}} · {{location}}{{/location}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}
  {{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-header"><span class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</span><span class="entry-date">{{startDate}} - {{endDate}}</span></div><div class="entry-subtitle">{{institution}}</div></div>{{/education}}</div>{{/education.length}}
  {{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}
  {{#languages.length}}<div class="section"><h2 class="section-title">Languages</h2>{{#languages}}<div class="entry"><span class="entry-title">{{name}}</span> — {{level}}</div>{{/languages}}</div>{{/languages.length}}
  {{#certifications.length}}<div class="section"><h2 class="section-title">Certifications</h2>{{#certifications}}<div class="entry"><span class="entry-title">{{name}}</span>{{#issuer}} · {{issuer}}{{/issuer}}{{#date}} · {{date}}{{/date}}</div>{{/certifications}}</div>{{/certifications.length}}
</div>`,
  },
  {
    name: 'Classic',
    slug: 'classic',
    description: 'Traditional resume layout with serif fonts. Ideal for conservative industries.',
    is_premium: false,
    sort_order: 2,
    html_css: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Georgia', 'Times New Roman', serif; color: #222; line-height: 1.6; padding: 32px; }
  .header { text-align: center; border-bottom: 2px solid #222; padding-bottom: 16px; margin-bottom: 20px; }
  .header h1 { font-size: 26px; letter-spacing: 2px; text-transform: uppercase; }
  .contact { font-size: 13px; margin-top: 8px; }
  .section { margin-bottom: 18px; }
  .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 2px; border-bottom: 1px solid #999; padding-bottom: 4px; margin-bottom: 10px; }
  .entry { margin-bottom: 10px; }
  .entry-header { display: flex; justify-content: space-between; }
  .entry-title { font-weight: bold; }
  .entry-date { font-style: italic; color: #555; font-size: 13px; }
  .entry-subtitle { font-style: italic; color: #444; }
  .entry-desc { font-size: 14px; margin-top: 4px; }
  .skills-list { font-size: 14px; }
  .summary { font-size: 14px; font-style: italic; }
</style>
<div class="header">
  <h1>{{fullName}}</h1>
  <div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}| {{phone}}{{/phone}} {{#location}}| {{location}}{{/location}}</div>
</div>
{{#summary}}<div class="section"><p class="summary">{{summary}}</p></div>{{/summary}}
{{#experience.length}}<div class="section"><h2 class="section-title">Professional Experience</h2>{{#experience}}<div class="entry"><div class="entry-header"><span class="entry-title">{{position}}</span><span class="entry-date">{{startDate}} – {{endDate}}</span></div><div class="entry-subtitle">{{company}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}
{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-header"><span class="entry-title">{{degree}}{{#field}} — {{field}}{{/field}}</span><span class="entry-date">{{endDate}}</span></div><div class="entry-subtitle">{{institution}}</div></div>{{/education}}</div>{{/education.length}}
{{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{skills}}</div></div>{{/skills.length}}`,
  },
  {
    name: 'Minimal',
    slug: 'minimal',
    description: 'Ultra-clean minimalist design. Great for creative professionals.',
    is_premium: false,
    sort_order: 3,
    html_css: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; line-height: 1.6; padding: 40px; max-width: 700px; }
  .header h1 { font-size: 32px; font-weight: 300; letter-spacing: -0.5px; }
  .contact { font-size: 13px; color: #888; margin-top: 4px; }
  .divider { border: none; border-top: 1px solid #e0e0e0; margin: 20px 0; }
  .section { margin-bottom: 20px; }
  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #999; margin-bottom: 12px; }
  .entry { margin-bottom: 14px; }
  .entry-title { font-weight: 500; font-size: 15px; }
  .entry-meta { font-size: 13px; color: #888; }
  .entry-desc { font-size: 14px; margin-top: 4px; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .skill-tag { border: 1px solid #ddd; padding: 3px 10px; border-radius: 20px; font-size: 12px; color: #555; }
</style>
<div class="header">
  <h1>{{fullName}}</h1>
  <div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}· {{phone}}{{/phone}} {{#location}}· {{location}}{{/location}}</div>
</div>
<hr class="divider">
{{#summary}}<div class="section"><p style="font-size:14px;color:#555;">{{summary}}</p></div>{{/summary}}
{{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}} @ {{company}}</div><div class="entry-meta">{{startDate}} – {{endDate}}{{#location}} · {{location}}{{/location}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}
{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} — {{field}}{{/field}}</div><div class="entry-meta">{{institution}} · {{endDate}}</div></div>{{/education}}</div>{{/education.length}}
{{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}`,
  },
  {
    name: 'Executive',
    slug: 'executive',
    description: 'Premium executive layout with dark sidebar. For senior professionals.',
    is_premium: true,
    sort_order: 4,
    html_css: `
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', sans-serif; display: flex; min-height: 100vh; }
  .sidebar { width: 240px; background: #1e293b; color: #e2e8f0; padding: 32px 20px; }
  .sidebar h1 { font-size: 22px; color: white; margin-bottom: 16px; }
  .sidebar .section { margin-bottom: 20px; }
  .sidebar .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #94a3b8; margin-bottom: 8px; }
  .sidebar .item { font-size: 13px; margin-bottom: 4px; }
  .main { flex: 1; padding: 32px; }
  .main .section { margin-bottom: 20px; }
  .main .section-title { font-size: 16px; color: #1e293b; border-bottom: 2px solid #1e293b; padding-bottom: 4px; margin-bottom: 12px; }
  .entry { margin-bottom: 12px; }
  .entry-header { display: flex; justify-content: space-between; }
  .entry-title { font-weight: 600; }
  .entry-date { color: #64748b; font-size: 13px; }
  .entry-subtitle { color: #475569; font-size: 14px; }
  .entry-desc { font-size: 13px; margin-top: 4px; color: #334155; }
</style>
<div class="sidebar">
  <h1>{{fullName}}</h1>
  <div class="section"><div class="section-title">Contact</div>{{#email}}<div class="item">{{email}}</div>{{/email}}{{#phone}}<div class="item">{{phone}}</div>{{/phone}}{{#location}}<div class="item">{{location}}</div>{{/location}}{{#linkedin}}<div class="item">{{linkedin}}</div>{{/linkedin}}</div>
  {{#skills.length}}<div class="section"><div class="section-title">Skills</div>{{#skills}}<div class="item">{{.}}</div>{{/skills}}</div>{{/skills.length}}
  {{#languages.length}}<div class="section"><div class="section-title">Languages</div>{{#languages}}<div class="item">{{name}} — {{level}}</div>{{/languages}}</div>{{/languages.length}}
</div>
<div class="main">
  {{#summary}}<div class="section"><p style="font-size:14px;color:#475569;">{{summary}}</p></div>{{/summary}}
  {{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-header"><span class="entry-title">{{position}}</span><span class="entry-date">{{startDate}} – {{endDate}}</span></div><div class="entry-subtitle">{{company}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}
  {{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-header"><span class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</span><span class="entry-date">{{endDate}}</span></div><div class="entry-subtitle">{{institution}}</div></div>{{/education}}</div>{{/education.length}}
</div>`,
  },
  {
    name: 'Creative',
    slug: 'creative',
    description: 'Bold, colorful design for creative roles in design and marketing.',
    is_premium: true,
    sort_order: 5,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#2d2d2d;line-height:1.5}.header{background:linear-gradient(135deg,#7c3aed,#2563eb);color:white;padding:40px 32px;text-align:center}.header h1{font-size:30px;font-weight:700}.header .subtitle{font-size:14px;opacity:.9;margin-top:4px}.content{padding:24px 32px}.section{margin-bottom:20px}.section-title{font-size:15px;color:#7c3aed;font-weight:600;margin-bottom:10px;display:flex;align-items:center;gap:8px}.section-title::before{content:'';width:4px;height:20px;background:#7c3aed;border-radius:2px}.entry{margin-bottom:12px;padding-left:12px;border-left:2px solid #e0e0e0}.entry-title{font-weight:600}.entry-date{color:#888;font-size:13px}.entry-desc{font-size:13px;margin-top:2px}.skills-list{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:linear-gradient(135deg,#ede9fe,#dbeafe);color:#5b21b6;padding:4px 14px;border-radius:20px;font-size:13px}</style>
<div class="header"><h1>{{fullName}}</h1><div class="subtitle">{{#email}}{{email}}{{/email}} {{#phone}}| {{phone}}{{/phone}} {{#location}}| {{location}}{{/location}}</div></div>
<div class="content">{{#summary}}<div class="section"><p style="font-size:14px;color:#555">{{summary}}</p></div>{{/summary}}{{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}} — {{company}}</div><div class="entry-date">{{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</div><div class="entry-date">{{institution}} · {{endDate}}</div></div>{{/education}}</div>{{/education.length}}{{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}</div>`,
  },
  {
    name: 'Tech Pro',
    slug: 'tech-pro',
    description: 'Developer-friendly layout with monospace accents. Built for tech roles.',
    is_premium: true,
    sort_order: 6,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0f172a;line-height:1.5;padding:32px}.header{margin-bottom:20px}.header h1{font-size:28px;font-weight:700}.header .contact{font-family:'Courier New',monospace;font-size:13px;color:#64748b;margin-top:4px}.section{margin-bottom:18px}.section-title{font-family:'Courier New',monospace;font-size:13px;color:#0ea5e9;text-transform:uppercase;letter-spacing:2px;padding-bottom:6px;border-bottom:1px dashed #cbd5e1;margin-bottom:10px}.entry{margin-bottom:12px}.entry-title{font-weight:600;font-size:15px}.entry-meta{font-family:'Courier New',monospace;font-size:12px;color:#64748b}.entry-desc{font-size:14px;margin-top:4px}.skills-list{display:flex;flex-wrap:wrap;gap:6px}.skill-tag{background:#0f172a;color:#38bdf8;padding:3px 10px;border-radius:4px;font-family:'Courier New',monospace;font-size:12px}</style>
<div class="header"><h1>{{fullName}}</h1><div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}| {{phone}}{{/phone}} {{#location}}| {{location}}{{/location}}</div></div>{{#summary}}<div class="section"><p style="font-size:14px">{{summary}}</p></div>{{/summary}}{{#skills.length}}<div class="section"><h2 class="section-title">// Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}{{#experience.length}}<div class="section"><h2 class="section-title">// Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}}</div><div class="entry-meta">{{company}} | {{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#education.length}}<div class="section"><h2 class="section-title">// Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} — {{field}}{{/field}}</div><div class="entry-meta">{{institution}} | {{endDate}}</div></div>{{/education}}</div>{{/education.length}}`,
  },
  {
    name: 'Academic',
    slug: 'academic',
    description: 'Structured layout for academia, research, and education roles.',
    is_premium: true,
    sort_order: 7,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Palatino Linotype','Book Antiqua',Palatino,serif;color:#1a1a1a;line-height:1.6;padding:36px;max-width:750px}.header{text-align:center;margin-bottom:24px}.header h1{font-size:24px;text-transform:uppercase;letter-spacing:3px}.header .contact{font-size:13px;color:#555;margin-top:6px}.section{margin-bottom:18px}.section-title{font-size:14px;font-variant:small-caps;letter-spacing:2px;border-bottom:1px solid #333;padding-bottom:3px;margin-bottom:10px}.entry{margin-bottom:10px}.entry-title{font-weight:bold;font-size:14px}.entry-meta{font-style:italic;font-size:13px;color:#666}.entry-desc{font-size:14px;margin-top:4px}</style>
<div class="header"><h1>{{fullName}}</h1><div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}· {{phone}}{{/phone}} {{#location}}· {{location}}{{/location}}</div></div>{{#summary}}<div class="section"><p style="font-size:14px;text-align:justify">{{summary}}</p></div>{{/summary}}{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</div><div class="entry-meta">{{institution}}, {{endDate}}</div></div>{{/education}}</div>{{/education.length}}{{#experience.length}}<div class="section"><h2 class="section-title">Professional Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}} — {{company}}</div><div class="entry-meta">{{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#skills.length}}<div class="section"><h2 class="section-title">Skills &amp; Competencies</h2><p style="font-size:14px">{{skills}}</p></div>{{/skills.length}}`,
  },
  {
    name: 'Elegant',
    slug: 'elegant',
    description: 'Sophisticated gold-accented design for luxury and finance.',
    is_premium: true,
    sort_order: 8,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1c1917;line-height:1.5;padding:36px}.header{border-bottom:3px double #b45309;padding-bottom:16px;margin-bottom:20px}.header h1{font-size:28px;color:#78350f;font-weight:300;letter-spacing:2px}.header .contact{font-size:13px;color:#78350f;margin-top:6px}.section{margin-bottom:18px}.section-title{font-size:13px;color:#b45309;text-transform:uppercase;letter-spacing:3px;margin-bottom:10px}.entry{margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #f5f0e8}.entry-title{font-weight:600;font-size:15px}.entry-date{color:#92400e;font-size:13px}.entry-subtitle{color:#78350f;font-size:14px}.entry-desc{font-size:13px;margin-top:4px}.skills-list{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{border:1px solid #d4a574;color:#78350f;padding:3px 12px;border-radius:2px;font-size:12px}</style>
<div class="header"><h1>{{fullName}}</h1><div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}· {{phone}}{{/phone}} {{#location}}· {{location}}{{/location}}</div></div>{{#summary}}<div class="section"><p style="font-size:14px;color:#44403c">{{summary}}</p></div>{{/summary}}{{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}}</div><div class="entry-date">{{company}} · {{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} — {{field}}{{/field}}</div><div class="entry-date">{{institution}} · {{endDate}}</div></div>{{/education}}</div>{{/education.length}}{{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}`,
  },
  {
    name: 'Bold',
    slug: 'bold',
    description: 'High-impact design with large typography. Stands out from the crowd.',
    is_premium: true,
    sort_order: 9,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#111;line-height:1.5}.header{background:#111;color:white;padding:40px 32px}.header h1{font-size:36px;font-weight:800;line-height:1.1}.header .contact{font-size:13px;color:#a1a1aa;margin-top:8px}.content{padding:24px 32px}.section{margin-bottom:20px}.section-title{font-size:20px;font-weight:800;text-transform:uppercase;margin-bottom:12px}.entry{margin-bottom:14px}.entry-title{font-weight:700;font-size:16px}.entry-meta{font-size:13px;color:#666}.entry-desc{font-size:14px;margin-top:4px}.skills-list{display:flex;flex-wrap:wrap;gap:8px}.skill-tag{background:#111;color:white;padding:5px 14px;border-radius:4px;font-size:13px;font-weight:600}</style>
<div class="header"><h1>{{fullName}}</h1><div class="contact">{{#email}}{{email}}{{/email}} {{#phone}}| {{phone}}{{/phone}} {{#location}}| {{location}}{{/location}}</div></div><div class="content">{{#summary}}<div class="section"><p style="font-size:15px">{{summary}}</p></div>{{/summary}}{{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}}</div><div class="entry-meta">{{company}} · {{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</div><div class="entry-meta">{{institution}} · {{endDate}}</div></div>{{/education}}</div>{{/education.length}}{{#skills.length}}<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div></div>{{/skills.length}}</div>`,
  },
  {
    name: 'Two-Column',
    slug: 'two-column',
    description: 'Space-efficient two-column layout. Great for experienced professionals.',
    is_premium: true,
    sort_order: 10,
    html_css: `<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Segoe UI',sans-serif;color:#1f2937;line-height:1.5;display:flex;min-height:100vh}.left{width:35%;background:#f1f5f9;padding:32px 20px}.right{width:65%;padding:32px 24px}.left h1{font-size:22px;margin-bottom:16px;color:#0f172a}.left .section{margin-bottom:18px}.left .section-title{font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#64748b;margin-bottom:8px}.left .item{font-size:13px;margin-bottom:4px;color:#334155}.right .section{margin-bottom:18px}.right .section-title{font-size:14px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;border-bottom:2px solid #2563eb;padding-bottom:3px;margin-bottom:10px}.entry{margin-bottom:10px}.entry-title{font-weight:600;font-size:14px}.entry-meta{font-size:12px;color:#64748b}.entry-desc{font-size:13px;margin-top:3px}.skill-tag{display:inline-block;background:white;border:1px solid #cbd5e1;padding:2px 10px;border-radius:3px;font-size:12px;margin:2px}</style>
<div class="left"><h1>{{fullName}}</h1><div class="section"><div class="section-title">Contact</div>{{#email}}<div class="item">{{email}}</div>{{/email}}{{#phone}}<div class="item">{{phone}}</div>{{/phone}}{{#location}}<div class="item">{{location}}</div>{{/location}}{{#linkedin}}<div class="item">{{linkedin}}</div>{{/linkedin}}</div>{{#skills.length}}<div class="section"><div class="section-title">Skills</div>{{#skills}}<span class="skill-tag">{{.}}</span>{{/skills}}</div>{{/skills.length}}{{#languages.length}}<div class="section"><div class="section-title">Languages</div>{{#languages}}<div class="item">{{name}} — {{level}}</div>{{/languages}}</div>{{/languages.length}}{{#certifications.length}}<div class="section"><div class="section-title">Certifications</div>{{#certifications}}<div class="item">{{name}}</div>{{/certifications}}</div>{{/certifications.length}}</div>
<div class="right">{{#summary}}<div class="section"><p style="font-size:14px;color:#475569">{{summary}}</p></div>{{/summary}}{{#experience.length}}<div class="section"><h2 class="section-title">Experience</h2>{{#experience}}<div class="entry"><div class="entry-title">{{position}}</div><div class="entry-meta">{{company}} · {{startDate}} – {{endDate}}</div><div class="entry-desc">{{description}}</div></div>{{/experience}}</div>{{/experience.length}}{{#education.length}}<div class="section"><h2 class="section-title">Education</h2>{{#education}}<div class="entry"><div class="entry-title">{{degree}}{{#field}} in {{field}}{{/field}}</div><div class="entry-meta">{{institution}} · {{endDate}}</div></div>{{/education}}</div>{{/education.length}}</div>`,
  },
];

async function seed() {
  console.log('Seeding templates...');

  for (const t of templates) {
    await query(
      `INSERT INTO templates (name, slug, description, is_premium, sort_order, html_css)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (slug) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         is_premium = EXCLUDED.is_premium,
         sort_order = EXCLUDED.sort_order,
         html_css = EXCLUDED.html_css`,
      [t.name, t.slug, t.description, t.is_premium, t.sort_order, t.html_css]
    );
    console.log(`  ✓ ${t.name} (${t.is_premium ? 'premium' : 'free'})`);
  }

  console.log(`\nDone! ${templates.length} templates seeded.`);
  await pool.end();
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
