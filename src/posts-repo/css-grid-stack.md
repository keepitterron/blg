---
title: CSS grid stack
description: An alternative way to position elements on top of each other by using grid instead of position:absolute
date: 03/27/2021
---

<style>
.stack {
  display: grid;
  grid-template-areas: "stack";
  aspect-ratio: 16/9;
  margin: 0 0 1rem;
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

.circle {
  background: honeydew;
  padding: 0.5rem;
}

.circle > div {
  border-radius: 100%;
}

.circle .l {
  width: 12rem;
  height: 12rem;
  background-color: lightcoral;
}
.circle .m {
  width: 8rem;
  height: 8rem;
  background-color: gainsboro;
}
.circle .s {
  width: 5rem;
  height: 5rem;
  background-color: forestgreen;
}

.circle p {
  font-weight: 600;
  font-size: 2rem;
}
</style>

Traditionally, the way we've achieved overlapping elements on top of each other has been `position:absolute`.  
If you also want to center stuff, you gotta use a combination of top/bottom left/right and the corresponding translate transform.  
It is not the easiest thing to work with, it requires a bit of code, it's error prone and it feels as fragile as it looks in code.

Fear no more, though, as I'm about to share my latest favorite technique: stacking elements on top of each other with CSS grid!

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

```html
<div class="stack">
  <img src="cover.jpg" />
  <article>
    <h2>Hello!</h2>
    <p>Breakfast is ready.</p>
  </article>
</div>
```

<div class="stack">
  <img src="assets/cover.jpg">
  <article>
    <h2>Hello!</h2>
    <p>Breakfast is ready.</p>
  </article>
</div>

We are defining a grid with a single [template area](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas) that we called `stack` (you can give it whatever name you want) and then we're placing every direct children of this container in the `stack` area, centered.  
It feels quite magic ✨

<br />

The `.stack` utility it's all it takes (plus some cosmetic styling) to achieve the example below:

<div class="stack circle">
  <div class="l"></div>
  <div class="m"></div>
  <div class="s"></div>
  <p>💖</p>
</div>

```html
<div class="stack circle">
  <div></div>
  <div></div>
  <div></div>
  <p>💖</p>
</div>
```
