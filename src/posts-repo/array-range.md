---
title: Creating an array of N elements
date: 6/17/2018
---
When I work on a new side project I like to spend an absurd amount of time focusing on critical stuff like making the code look good for no particular reason. I’m finally free of restrictions, standards and code reviews and I can let my inner kid go wild.
One of these instances is getting rid of for loops.

I’m talking about the most classic of the classic loops:
```js
const array = [];
for(let i = 0; i < 100; i++) {
  array.push(i);
}
```
There is nothing wrong with this piece of code and it does not need to be optmized. But it __feels__ dirty to me. It does not feel modern.
And it's total bullshit of course.

Whenever I have a similar scenario I want really bad to use `map`. It would be **so** clean:
```js
const array = Array(100).map((_, i) => i);
```
Look at it! Look at how beautiful it is.
Problem is: it does not work. And it does not work because the array constructor creates an **empty array of lenght 100** in this case.
Please note: not an array with 100 empty slots, but an array with no slots and just an indication that its length is 100:
```js
{
  length: 100,
  __proto__: Array(0),
}
```
`Map` tries to iterate over the values of this array but there's nothing to iterate over: `console.log(array) // [empty x 100]`.

A for loop works beautifully in this case, but there are a number of ways to better please my own sense of code aesthetics.

[Array.from](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from) creates an array from an `arrayLike` object. That is objects with a length property and indexed elements.
In our case the object `{length: 100}` satisfies the definition of `arrayLike` and we can `map` over its elements. Better yet, `Array.from` takes a callback as a second argument that does the mapping for us without the creation of an intermediate array:

```js
const array = Array.from({length: 100}, (_, i) => i);
```

The [spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) expands an `iterable`.
In our case returns 100 `undefined` elements that get expanded into the empty array (`[]`).
```js
const array = [...Array(100)].map((_, i) => i);
```

Again, this is totally unnecessary: a for loop is simple enough, it's readable, it's well understood even by people with little experience and it's performant.
The definition of readable code - however - is quite subjective I believe, when I can write functional JS or I don't have to make it readable by less experienced developers I much prefer to avoid the use of loops in favour of a more terse synatx, immutability and the use of pure functions.
