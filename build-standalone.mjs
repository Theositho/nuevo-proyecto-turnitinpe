import fs from 'node:fs';
import path from 'node:path';
import { build } from 'vite';
import react from '@vitejs/plugin-react';

const ARTIFACT_PATH = '/home/antigravity/.gemini/jetski/brain/v1/default/jetski_remote_agents_3p/5f7323c2-b318-4ab3-9214-37702e9eadbf/TurnitinPE-v2.html';
const REPO_STANDALONE = '/home/antigravity/Theositho/nuevo-proyecto-turnitinpe/TurnitinPE-Standalone.html';
const WEB_STANDALONE = '/home/antigravity/Theositho/turnitinpe-v2-web/TurnitinPE-Standalone.html';

console.log('Building Vite bundle for production...');
// 1. Regular vite build for dist
await build({
  base: './',
  plugins: [react()],
});

// 2. Find generated CSS in dist/assets
const distFiles = fs.readdirSync('dist/assets');
const cssFile = distFiles.find(f => f.endsWith('.css'));
if (!cssFile) throw new Error('CSS file not found in dist/assets');
const cssContent = fs.readFileSync(path.join('dist/assets', cssFile), 'utf-8');

console.log('Bundling Standalone IIFE JavaScript...');
const iifeResult = await build({
  configFile: false,
  plugins: [react()],
  build: {
    write: false,
    rollupOptions: {
      input: 'src/main.jsx',
      output: {
        format: 'iife',
        inlineDynamicImports: true,
        name: 'TurnitinApp',
      },
    },
  },
});

const jsChunk = iifeResult.output.find(c => c.type === 'chunk');
if (!jsChunk) throw new Error('IIFE JavaScript chunk not found');

const standaloneHtml = `<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f172a" />
    <meta
      name="description"
      content="Plataforma académica profesional TurnitinPE · Cursos de investigación, revisión de similitud y detección de IA con Turnitin Feedback Studio, Originality, QuillBot y Laboratorio de IA."
    />
    <title>turnitinpe · Plataforma Académica de Integridad, Cursos e Inteligencia Artificial</title>
    <link rel="icon" type="image/svg+xml" href="./favicon-turnitin.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;450;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
      rel="stylesheet"
    />
    <style>
${cssContent}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${jsChunk.code}
    </script>
  </body>
</html>
`;

console.log(`Writing standalone file (${(standaloneHtml.length / 1024).toFixed(1)} KB)...`);
fs.writeFileSync(REPO_STANDALONE, standaloneHtml, 'utf-8');
console.log('✓ Wrote to', REPO_STANDALONE);

if (fs.existsSync('/home/antigravity/Theositho/turnitinpe-v2-web')) {
  fs.writeFileSync(WEB_STANDALONE, standaloneHtml, 'utf-8');
  console.log('✓ Wrote to', WEB_STANDALONE);
}

try {
  fs.writeFileSync(ARTIFACT_PATH, standaloneHtml, 'utf-8');
  console.log('✓ Wrote to artifact', ARTIFACT_PATH);
} catch (e) {
  console.warn('Artifact write skipped or failed:', e.message);
}

console.log('🎉 Standalone build completed successfully!');
