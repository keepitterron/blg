---
title: CSS grid stack
date: 03/27/2021
---

A pancake stack.

```css
.stack {
  display: grid;
  grid-template-areas: 'stack';
}

.stack > * {
  grid-area: stack;
  place-self: center;
  text-align: center;
}
```

<style>
.stack {
  display: grid;
  grid-template-areas: "stack";
  aspect-ratio: 16/9;
}

.stack > * {
  grid-area: stack;
  place-self: center;
  text-align: center;
}

.stack img {
  width: 100%;
  opacity: 0.5;
}

.stack h2 {
  font-size: clamp(3.5rem, 5vw, 5rem);
  margin: 0 0 1rem;
}

.stack article {
  z-index: 1;
}


</style>
<div class="stack">
<img src="assets/cover.jpg">
  <article>
    <h2>Hello!</h2>
    <p>Breakfast is ready.</p>
  </article>
</div>
