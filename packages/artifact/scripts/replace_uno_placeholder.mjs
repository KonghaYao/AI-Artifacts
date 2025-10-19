import fs from 'fs';
import path from 'path';

const unoPlaceholder = '@unocss-placeholder';
const unoCss = fs.readFileSync('./dist/index.js', 'utf-8');

const replacedCss = unoCss.replace(unoPlaceholder, fs.readFileSync('./dist/index.css', 'utf-8'));

fs.writeFileSync('./dist/index.js', replacedCss);
