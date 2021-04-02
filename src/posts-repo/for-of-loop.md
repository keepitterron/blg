---
title: The for-of loop
date: 06/10/2018
---
`for-of` is a new loop in ES2015 that replaces both `for-in` and `forEach()` and supports the new iteration protocol (that is, objects that have a `[Symbols.iterator]` property).

The `[Symbol.iterator]` property allows us to manually iterate over the collection by calling the `[Symbol.iterator]().next()` method to retrieve the next item in the collection.

It combines the short syntax of `forEach` with the familiar `for` loop (`break/continue` included).

Use it to loop over **iterable objects** (Arrays, Strings, Maps, Sets, Generators, NodeLists...):

```js
const iterable = ['a', 'b'];
for (const x of iterable) {
    console.log(x);
}
// a
// b
```

If in need to be able to access the `key/index` of the iterable object, `destructuring` might be used:

```js
const map = new Map()
  .set(false, 'no')
  .set(true, 'yes');
for (const [key, value] of map) {
    console.log(`key: ${key}, value: ${value}`);
}
// key: false, value: no
// key: true, value: yes
```

`Array.prototype.entries()` needs to be used in combination with destructuring when working with arrays:

```js
const array = ['a', 'b'];
for (const [index, value] of array) {
    console.log(`index: ${index}, value: ${value}`);
}
// index: 0, value: a
// index: 1, value: b
```

## At a glance
**for**
```js
const array = ['a', 'b'];
for(let i; i < array.length; i++) {
  console.log(array[i]);
}
// a
// b
```

**for-in**
```js
const array = ['a', 'b'];
for(const i in array) {
  console.log(array[i]);
}
// a
// b
```

**for-of**
```js
const array = ['a', 'b'];
for (const value of array) {
  console.log(value);
}
// a
// b
```
