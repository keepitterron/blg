---
title: Null is garbage, and other lessons from a Vue TS compiler meltdown
description: Here's the story of how Yarn workspaces, TypeScript structural typing, and Vue's reactivity system conspired to create a perfect storm, and what it teaches us about typing template refs.
date: 03/14/2026
---

Monorepos are great until they aren’t. Recently, a seemingly innocent configuration change in a React package brought our entire Vue TypeScript compiler to its knees. 

A completely unreadable `TS2345: Argument of type...` wall of text from `vue-tsc` that hid the actual, far more interesting problem. All brought to you by a standard, everyday Vue template ref.

Here’s the story of how Yarn workspaces, TypeScript structural typing, and Vue's reactivity system conspired to create a perfect storm, and what it teaches us about typing template refs.

## The Crime Scene

It started when a standard template ref suddenly caused our build to crash:

```typescript
const threeContainerRef = ref<HTMLDivElement | null>(null);
```

When running `vue-tsc`, the console just vomited a massive `TS2345` error. It was just noise: hundreds of lines of nested DOM properties complaining about an assignment mismatch.

I didn't actually spot the real issue until I hovered over the ref in my IDE, which quietly revealed the underlying truth: `"inferred type of this node exceeds the maximum length the compiler will serialize"`.

Instead of recognizing this as a simple `Ref<HTMLDivElement | null>`, TypeScript was suffering a mental breakdown. It tried to evaluate the `HTMLDivElement` down to its raw base properties—all 320+ of them (`align`, `addEventListener`, `focus`, etc.). Because we had `"declaration": true` enabled in our `tsconfig.json`, TS tried to write this multi-megabyte type definition to a `.d.ts` file, hit its hardcoded safety limit, and gave up.

But this code had been working fine for months. So what changed?

## The Catalyst: A React config change

We had recently added `"type": "module"` to an adjacent React package in our monorepo.

Why did that break Vue? Because Yarn 1 is an agent of chaos. Switching to ESM caused Yarn to completely reshuffle its hoisted dependencies. During this reshuffle, it unearthed an older version of `@vue/reactivity` (v3.5.26) buried deep inside another dependency (`vue-datepicker-next`) and hoisted it.

Now, our monorepo had *two* different versions of Vue running simultaneously.

## The Mechanics: Why TypeScript panicked

TypeScript uses **structural typing**, meaning it cares about the *shape* of an object, not its name.

When TS evaluated our template ref, it saw the `Ref` interface from the older `@vue/reactivity` and compared it to the `Ref` interface from our main app (`v3.5.30`). It noticed a mismatch. To prove the two were compatible despite the mismatch, it panicked and recursively expanded the generic `HTMLDivElement` to structurally verify every single property.

Bam! Serialization limit hit.

*(Note: We fixed the root cause by forcing a single version of Vue via Yarn `resolutions`, but it exposed a major flaw in how we were typing our refs).*

## The Takeaway: How to type your Template Refs

This whole ordeal highlighted exactly how TypeScript handles Vue's `ref` inference. If you want to save the compiler (and yourself) from having a breakdown, here is the hierarchy of how to write template refs:

### The Risky Way (What we were doing)

```typescript
const threeContainerRef = ref<HTMLDivElement | null>(null);
```

Here, TS has to *infer* the return type of `ref()`. When complex generic types (like Vue's deep reactivity unwrapping) meet a union like `| null` and duplicate node modules, TS is forced to structurally expand the type to verify it. It's a memory bomb waiting to go off.

### The Bulletproof Way (Explicit Annotation)

```typescript
import type { Ref } from 'vue';

const threeContainerRef: Ref<HTMLDivElement | null> = ref(null);
```

By explicitly telling TS what the type is upfront, it skips the complex inference calculation entirely. No expansion, no panics.

### The Pragmatic Way (Recommended)

```typescript
const threeContainerRef = ref<HTMLDivElement>();
```

If you omit the initial value, it defaults to `HTMLDivElement | undefined`. And this brings us to an important nuance in Vue 3...

## Wait, what's the difference between `ref()` and `ref(null)`?

In Vue 3 templates, when you bind a DOM element (`<div ref="threeContainerRef">`), the element is attached after the component is mounted. Before mount, the ref holds whatever you initialized it with.

So, what's the difference between initializing with `undefined` vs `null`?

If you know me, or if you've ever worked with me, you know my stance on this: in my 20 years of writing JavaScript, `null` has brought me nothing but sorrow. Just let things be `undefined` and rely on JavaScript's natural falsy evaluation. The world is a simpler, cleaner place when you banish `null` from your codebase and let the language behave the way it wants to.

As it turns out, the Vue and TypeScript compilers agree with me.

1. **`ref()` initializes to `undefined`.** This is the native JavaScript default for uninitialized variables. TypeScript handles `| undefined` elegantly inside complex generic conditional types. It evaluates instantly without unpacking the entire DOM tree.
2. **`ref(null)` initializes to `null`.** You are explicitly introducing a union type (`T | null`). In Vue's internal type unwrapping, this forces a completely different, heavier path through the compiler.

By simply using `ref<HTMLDivElement>()`, you get better type inference performance, avoid catastrophic serialization traps, and align with the way JavaScript was actually meant to be written. You just have to remember to use optional chaining (`threeContainerRef.value?.focus()`) later, which you would have to do anyway.

### TL;DR

Yarn workspaces will betray you, explicit typing saves compiler memory and omitting `null` on template refs is just further proof that `null` belongs in the trash.

(I am being dramatic, but I stand by it. `null` is garbage.)
