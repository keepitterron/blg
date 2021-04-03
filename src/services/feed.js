import posthtml from 'posthtml';
import urls from 'posthtml-urls';
import jstoxml from 'jstoxml';
import { escape } from 'html-escaper';

const { toXML } = jstoxml;

export const FEED_CONTENT_TYPE = 'application/atom+xml';

export function buildFeedXML({ title, updated, baseUrl, posts = [], author, feedPath }) {
  return toXML({
    _name: 'feed',
    _attrs: {
      xmlns: 'http://www.w3.org/2005/Atom',
    },
    _content: [
      { title },
      { _name: 'link',
        _attrs: {
          href: new URL(feedPath, baseUrl).href,
          rel: 'self',
        },
      },
      { _name: 'link',
        _attrs: {
          href: baseUrl,
        },
      },
      { author: { name: author } },
      { updated },
      { id: baseUrl },
      ...posts.map(buildPostData(baseUrl)),
    ],
  }, {
    header: true,
    indent: '  ',
  });
}

function buildPostData(baseUrl) {
  return (post) => {
    const { url, title, date, html } = post;
    const { href } = new URL(url, baseUrl);
    return {
      entry: [
        { title },
        { _name: 'link',
          _attrs: {
            href,
          } },
        { id: href },
        { updated: () => date.toISOString() },
        { _name: 'content',
          _attrs: {
            type: 'html',
          },
          _content: escape(html),
        },

      ],
    };
  };
}

// Borrowed from https://github.com/11ty/eleventy-plugin-rss/blob/master/src/htmlToAbsoluteUrls.js
export async function htmlToAbsoluteUrls(htmlContent, baseUrl, processOptions = {}) {
  if (!baseUrl) {
    throw new Error('BaseURL required');
  }

  const options = {
    eachURL(url) {
      return new URL(url.trim(), baseUrl).href;
    },
  };

  const modifier = posthtml().use(urls(options));

  const result = await modifier.process(htmlContent, processOptions);
  return result.html;
}
