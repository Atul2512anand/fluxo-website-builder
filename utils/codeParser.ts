
import { WebsiteCode } from '../types';

export const parseLLMResponse = (text: string): WebsiteCode => {
  const htmlRegex = /```html\n?([\s\S]*?)```/i;
  const cssRegex = /```css\n?([\s\S]*?)```/i;
  const jsRegex = /```javascript\n?([\s\S]*?)```/i;
  const jsRegexAlt = /```js\n?([\s\S]*?)```/i;

  const htmlMatch = text.match(htmlRegex);
  const cssMatch = text.match(cssRegex);
  const jsMatch = text.match(jsRegex) || text.match(jsRegexAlt);

  // If blocks are missing, we try to be more aggressive or return empty
  return {
    html: htmlMatch ? htmlMatch[1].trim() : '<!-- No HTML found -->',
    css: cssMatch ? cssMatch[1].trim() : '/* No CSS found */',
    js: jsMatch ? jsMatch[1].trim() : '// No JS found',
  };
};

export const combineToSingleHtml = (code: WebsiteCode): string => {
  const { html, css, js } = code;
  // Simple injection logic: Replace the link/script tags or append to head/body
  let combined = html;
  
  // Inject CSS
  if (combined.includes('</head>')) {
    combined = combined.replace('</head>', `<style>${css}</style>\n</head>`);
  } else {
    combined = `<style>${css}</style>\n` + combined;
  }

  // Inject JS
  if (combined.includes('</body>')) {
    combined = combined.replace('</body>', `<script>${js}</script>\n</body>`);
  } else {
    combined = combined + `\n<script>${js}</script>`;
  }

  return combined;
};
