---
title: A static site generator built with fastify js
description: Building a static site generator with fastifyjs, including hot reaload for fast development
date: 04/04/2021
---

Building a blog has been my favorite way of playing with new tech since forever. I'm not constraint by anything, and I can make stuff the way I like.

It's an excellent playground for experimentation, and even though there's a great choice in terms of static site generators, I chose to build my own, and I'm going to walk you through the concepts involved in the process.

<img src="assets/lighthouse.png" alt="A perfect 100 score from lightouse for this blog" />

## The rule of least power

I like to think about tools in terms of cost: anything I add on top of what's available natively will add some overhead; if I can avoid it, I will. The least powerful tool that can get the job done is most probably the right one.

- The web is fast and easy by design; we don't always need to complicate things. Write HTML, inline CSS, leverage the fact that [web servers will serve index.html](https://en.wikipedia.org/wiki/Webserver_directory_index) by default when accessing a folder.
- Writing HTML is great, but doing it for every article would be a waste of time, and it would be error-prone. Every change needs to be repeated for all files. I need to write some software that builds some abstractions: let me write the article [in a better-suited format](https://daringfireball.net/projects/markdown/syntax) and do all the heavy lifting for me with just one command.
- I already use version control (git) to save my code and keep an history somewhere online. It would be nice if I could [hook into this process](https://github.com/features/actions) so that I can write some software that builds my website and saves this new version to a server, ready to be accessed in a web browser.

## Inception

The blog generator reads markdown files, parses this data to HTML, and saves it to the appropriate location:

- [fs module](https://nodejs.org/api/fs.html#fs_fs_mkdir_path_options_callback) from Node to write to files and folders
- [front-matter](https://www.npmjs.com/package/front-matter) to read markdown files with a special syntax for metadata (title, date, category...)
- [markdown-it](https://github.com/markdown-it/markdown-it) to transform markdown to HTML
- [highlight.js](https://github.com/highlightjs/highlight.js/) to syntax highlight the code I add

A typical post looks like:

````md
---
title: A title
date: 05/04/2021
---

# This is a title

This a paragraph

```js
const whatIsThis = 'some code';
```
````

Pages are built using the [handlebars template system](https://handlebarsjs.com/), which allows to create HTML dynamically.

```js
const variables = { posts: [{ title: 'Post title', formattedDate: Date.now() }] };
const html = handlebars.render('postList.hbs', variables);
```

```hbs
  <ul class="postList">
    {{# each posts}}
    <li>[{{formattedDate}}] <a href="{{url}}">{{title}}</a></li>
    {{/each}}
  </ul>
```

A list of all posts is saved as `index.html` in the public root folder, and then all posts are saved one by one with the file structure: `post-slug/index.html`
A [GitHub action](https://github.com/JamesIves/github-pages-deploy-action) will run the build command every time I push to main and publish a new version of my blog to GitHub pages that is served using my custom domain.

```
index.html
├── my-first-post/
│   └── index.html
├── my-second-post/
│   └── index.html
└── my-latest-blog-post/
    └── index.html
```

## Adding a web server for development

This process works pretty well, but it scales poorly. Every time I'm writing a blog post, I would have to build the entire blog to check the changes. This could happen a hundred times as I'm writing a new article, highly inefficient!

That's why I added a [fastify web server](https://www.fastify.io/) in development to help me build things on the fly. I don't have to build the entire blog every time: changes are just a page refresh away now!

Creating dynamic HTML pages with a web server is relatively easy: that's what web servers are for!
I can use the same logic I had before to transform markdown to HTML and then pass it to my routes, [point-of-view](https://github.com/fastify/point-of-view) can render html from handlebars templates, so I can reuse those too!

```js
fastify.register(require('point-of-view'), {});

fastify.get('/', (request, reply) => {
  reply.view('list.hbs', { posts: postsCache, ...viewGlobalOptions });
});
```

Even reusing some logic, though, I wasn't satisfied with repeating the same process for development and production in two different ways; there must be a more efficient way.

It turns out there is. For a project like this, I can leverage [fastify.inject](https://www.fastify.io/docs/latest/Testing/#benefits-of-using-fastifyinject), a utility function that helps you make fake HTTP calls to the server. It's intended to be used to test applications, but it works pretty well for our use case: I call every blog post to let fastify do all the heavy lifting, and then I save the HTML response to its appropriate file and location.

The fastify web server is used to navigate the blog in development and to generate static HTML at build time!

```js
const urls = await getAllUrls();
for (const url of urls) {
  // here's where the magic happens.
  // inject will get a response without any network calls
  const response = await app.inject({ method: 'GET', url: `/${url}` });

  await createPost(`${url}/index.html`, response.body);
}
```

The fastify web server is used to navigate the blog in development and to generate static HTML at build time!

## Nice to haves

Now that the process is working end to end, I can add some candies: fast refresh is first!

Again, we use native tools and leverage how they work. I want to automatically refresh the page every time I make some changes on the backend, and I know already that every change will restart the server already: [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) is perfect for this!

When the server restarts, it will close the connection, and the client will try to reconnect; when it does, it will simply refresh the page to show the new changes.

```js
function connect(shouldReload = false) {
  const ws = new WebSocket('ws://localhost:3000/ws');

  // on open is called as soon as a connection happens with the server
  ws.onopen = () => shouldReload && location.reload();

  // on close is called when the server disconnects (because it's restarting)
  ws.onclose = () => setTimeout(() => connect(true), 1000);
}
```

<video src="https://cdn.loom.com/sessions/thumbnails/269368b9988c4437828cdc40806ac17d-00001.mp4" playsinline mute loop autoplay>A video of hot reload in action: changing something on the server will trigger a page reload.</video>

## What we learned

Building a static site generator consists of transforming data from an arbitrary format to HTML and save this HTML to disk ready to be served to a web browser.

For a better developer experience, we use a web server in development: watch mode reloads the server when files change on disk, removing the burden of manually perform an action to see changes reflected in the browser.  
We can leverage this fact by listening to this event through a WebSockets connection and trigger a page reload with javascript.

The development process can be automated through services like GitHub actions, executing commands every time the code base is updated.

[You can read [the source code for this blog](https://github.com/keepitterron/blg) on GitHub!]
