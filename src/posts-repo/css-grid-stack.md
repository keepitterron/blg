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
}

.stack h2 {
  font-size: clamp(3.5rem, 5vw, 5rem);
  margin: 0 0 1rem;
}


</style>
<div class="stack">
<img src="https://images.unsplash.com/photo-1541288097308-7b8e3f58c4c6?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=1950&q=80">
  <div>
    <h2>Hello!</h2>
    <p>Breakfast is ready.</p>
  </div>
</div>
