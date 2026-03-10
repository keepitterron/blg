---
title: LLMs speak to my laziness
description: How a late night experiment with Codex turned into a production-ready 3D cabinet configurator, and what I learned about steering AI through code I don't fully understand. Turns out the boring best practices we've preached for years (tests, docs, types, coherent style) are exactly what make LLMs effective collaborators.
date: 10/03/2026
---

## Rage against the machine

A couple of months ago I switched from being severely skeptical towards AI as a coding tool, to embracing our new artificial overlords.
While I care about and enjoy coding as a craft, I've come around to appreciate orchestrating LLMs to speed up my workflow.
Frontier models have become so good at coding that ignoring them would be counterproductive.

## Experiments that would never be

As I was stealth killing Athenian soldiers as Kassandra in Assassin's Creed Odyssey, I thought it would be cool to start effectively looking into 3D for our cabinet configurator product.

I like the 2D rendering for quickly building cabinetry, but the power of rotating a model from all angles is undefeated.

So I pulled out my laptop and used GPT 5.3-Codex on my free account to ask OpenAI to subsidize my experiment: 
> can you use the cabinet configuration to render a 3D model? Use the 2D rendering as a base.

Now, Codex has surprised me one-shotting complex problems before, but this was still something for my own exclusive enjoyment: a starting point for me to explore Three.js and 3D rendering.

That is not what happened, let me tell you.
The produced output was too good to be ignored and I quickly shared it internally as a tease: it worked a bit too well and people wanted more. I wanted more. The genie could not be put back into the bottle.

<img src="assets/3dnator.gif" alt="First version of the 3D cabinet configurator" />

## Experiments that are just right

A few things have aligned quite well here: the configurator is well structured, well tested and well documented. 
While I did put a lot of effort and care into it, LLMs have done their part by making it trivial to keep tests and documentation up to date and coherent. It is a geometry heavy project and I do not possess any related knowledge, at least I didn't before Claude helped me get the right algos, the right verbiage and the right papers to learn from.

With all this context and wealth of documentation, Codex was able to easily navigate the problem space and project it into another solved problem: cabinets built with Three.js. It's just boxes on top of boxes next to other boxes.

## Human in the loop

First order of the day was understanding the generated code. I have very limited experience with Three.js and there was just too much code for me to go through; from experience Codex does not output the type of code I like to write either. 

This was going to be difficult: **I wanted a bike and now it was time to start pedaling.**

I asked the model to do what they do best: explain the code back to me like I'm 5 (at least mentally). Comment every function like I know nothing of geometry (I actually don't) nor Three.js (it's true). Don't be afraid to dumb it down and heavily reference documentation and Wikipedia.

While the Wikipedia page for the Euler rotation was pretty useless to me, the Three.js documentation coupled with the code was enough for me to get a better and better picture of what was going on.

Armed with this knowledge and so many comments I asked Claude to do an adversarial review of the code written: it was happy to comply and I had fun pitting two models against each other.

## Do I actually get it?

Time for polish came by very quickly and I soon found the limits of my own understanding: why are the colors off? How do I push this box further back? Why are the handles off?
I really tried but this was still out of my reach.

So I spent an hour going back and forth in a conversation with AI: I could not prompt correctly because I did not really know what I was asking. It was frustrating.
The loop was familiar though: you start with broad questions and you learn as you prompt until you know enough to refine your line of questioning.

One technique I've relied upon heavily is to ask the model to explain to me what I was asking and how I should have asked it instead. Enhancing my [productive struggle](https://blog.bryanl.dev/posts/ai-senior-engineer-pipeline/).

Subsequent prompts were much better and the feedback loop was getting tighter and more fulfilling.

## Production ready

Now I finally had a product I was happy with and I really wanted to put in front of our users, but the code was verbose and hard to follow. If I cannot review it, how can I ask my team to do it?

So I did what I'm doing very often lately: ask Claude to refactor it according to my own style and taste; turns out LLMs are good at following instructions in a way I'm not. I especially trust Opus.

The refactoring process is aided by LLMs in two ways: doing the actual writing of the code and conversing back and forth on how to architect it well. I do most of the thinking and I am the one steering the machine, I need to own the process and end result.

<img src="assets/cabinator-3d.gif" alt="Ready for production!" />

## Future proof

With the product working and polished and the code pleasing my senses, this is ready for the next phase: hitting production and being open for modification.

Coherent coding style and architecture, full test suite and plenty of up to date documentation make it trivial to ask Claude to one-shot new features provided the scope is small enough.

I can (and I did) take out my phone as I'm walking my dog and dump some context into the artificial machine, then open up the PR and test it locally once I'm home. Most of the times I don't have to do anything, all the primitives are already there:

- tickets are well formed and provide the full context
- code is coherent and provides enough examples of how things should be done
- documentation and comments in code to help navigate and explain
- tests are up to date and plentiful to avoid mistakes and regressions
- codebase has types and linting and automations

These have been best practices for years. None of this is new. But now, it speaks to my laziness.
