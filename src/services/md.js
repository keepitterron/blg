import hljs from 'highlight.js';
import Markdown from 'markdown-it';

export const md = Markdown({
  html: true,
  highlight,
});

function wrapContent(content) {
  return `<pre class="hljs"><code>${content}</code></pre>`;
}

function highlight(content, language) {
  const isSupported = language && hljs.getLanguage(language);
  const escapedContent = md.utils.escapeHtml(content);

  if (isSupported) {
    try {
      const highlighted = hljs.highlight(content, { language });
      return wrapContent(highlighted.value);
    } catch (_) {
      // nothing
    }
  }

  return wrapContent(escapedContent);
}
