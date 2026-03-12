import fs from 'fs';
import path from 'path';
import { pool } from './index';

const TEMPLATES_DIR = path.join(__dirname, 'templates');

const templateMap: Record<number, string> = {
  1: 'modern-blue.html',
  2: 'classic.html',
  3: 'minimal.html',
  4: 'executive.html',
  5: 'creative.html',
};

async function updateTemplates() {
  console.log('Updating templates...');

  for (const [id, filename] of Object.entries(templateMap)) {
    const filePath = path.join(TEMPLATES_DIR, filename);
    if (!fs.existsSync(filePath)) {
      console.log(`  SKIP: ${filename} not found`);
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    await pool.query('UPDATE templates SET html_css = $1 WHERE id = $2', [html, parseInt(id as string)]);
    console.log(`  Updated template #${id}: ${filename} (${html.length} chars)`);
  }

  console.log('Done!');
  await pool.end();
}

updateTemplates().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
