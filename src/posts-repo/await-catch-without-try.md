---
title: Await a promise without try/catch
date: 04/01/2021
---

As widespread and valuable as `await` is in Javascript, I really cannot stand wrapping it in a `try/catch`.

Most of the time I use a catch block, I want to prevent the function from blocking the flow and instead gracefully recover by returning some default value. Or maybe the operation is not business-critical, and it can fail silently.  
In these cases, a try/catch is overly verbose and can make the code harder to parse or make some patterns look awkward (like having to declare a variable outside of the block to use it outside of it).

```js
let posts = [];
try {
  posts = await getAllPosts();
} catch (error) {
  log(error);
}

if (!posts.length) {
  return [];
}

// continue with the code
```

We can leverage the fact that every awaitable function is essentially a promise and use [Promise.prototype.catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) to clean up our code and make it simpler.

```js
const posts = await getAllPosts().catch((error) => {
  log(error);

  return [];
});

if (!posts.length) {
  return [];
}

// continue with the code
```

This pattern looks even nicer when the use-case is awaiting a function that is not critical:

```js
await promise.catch(() => null);

// instead of

try {
  await promise;
} catch (_) {
  // do nothing
}
```

I also use this technique when i want to further process data in the same context:

```js
const post = await getSinglePost().then(post => withAbstract(post));

// instead of
const post = await getSinglePost();
const postWithAbstract = withAbstract(post));

// or
const post = withAbstract(await getSinglePost()); // this feels dirty
```
