# Functional Typescript
  14.04.2021



## Functional roots of JavaScript


## Functional roots of JavaScript
  ### History and influences

* [The World's Most Misunderstood Programming Language](https://www.crockford.com/javascript/javascript.html) - "Lisp in C's Clothing" (Douglas Crockford)
* [Brendan Eich on Creating JavaScript in 10 days](https://thenewstack.io/brendan-eich-on-creating-javascript-in-10-days-and-what-hed-do-differently-today/)
  > “I was lured with this idea of doing a very-popular-with-academics language called Scheme… The idea was ‘Come and do Scheme in Netscape. Put this programming language into the browser.'” 


## Functional roots of JavaScript
  ### History and influences

* [The Nature of JavaScript](http://speakingjs.com/es5/ch03.html), from "Speaking JavaScript: An In-Depth Guide for Programmers" (Dr. Axel Rauschmayer)
  <img src="http://speakingjs.com/es5/images/spjs_0701.png" alt="JavaScript Influences" width="600" height="400">


## Functional roots of JavaScript
  ### Similarities with Scheme

* Functions are "first-class citizens", can be passed as parameters
* Arrays are similar to Lists in Scheme
* Language core conceptually simple and small, using simplistic C-like syntax ("fashionable" in the 1990s, Java hype)
* Comparison of [Scheme code](https://github.com/antivanov/functional-typescript/blob/main/src/functional-roots/ntuples.scm) vs [JavaScript code](https://github.com/antivanov/functional-typescript/blob/main/src/functional-roots/ntuples.js)
* However also differences, for example:
  - [no tail call optimization](https://github.com/antivanov/functional-typescript/blob/main/src/functional-roots/tail.call.optimization.js)
  - JavaScript encourages and supports more imperative style



## Here comes Typescript (2012)
  ### Reinvigorating functional roots of JavaScript

<sub>No single definition of what "functional programming" is, but at different times different languages promoting different philoshopies tended to be
more popular.</sub>

* <= 1990s - functional programming is mostly about functions
* 2010s - functional programming is mostly about functions, types, immutability
  - Larger more complex projects require static typing (for example, SPAs)
  - Advances in the type theory and more languages with more advanced type systems
  - Combining OOP and functional programming, OOP != "shared mutable state" (Scala)


## Here comes Typescript (2012)
  ### Reinvigorating functional roots of JavaScript

* Keep the core JavaScript philosophy and ideas intact rather than try to invent a new Java-like language (sorry [Dart](https://dart.dev/guides/language), you might had gotten this wrong)
* A number of JavaScript alternatives in 2013 ["JavaScript and Friends: CoffeeScript, Dart and TypeScript"](https://smthngsmwhr.wordpress.com/2013/02/25/javascript-and-friends-coffeescript-dart-and-typescript/)
* Typescript influenced JavaScript, both embraced OOP and introduced features improving some of earlier quirks and boiler-plate (i.e. modules, classes, etc.)
* Add modern type system on top of JavaScript, structural typing
* Enables larger projects and better code organization
* Enables building more functional-like utilities and libraries


## Typeclasses
  ### Monoid typeclass as an example

* Way to extend the functionality of an existing class without altering its code, implemented as interfaces
* Typeclass example in Typescript: [Monoid](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/monoid.ts#L3-L5)
* Monoid [laws](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/spec/typeclasses/monoid.spec.ts#L43-L79)
* More real-life [example](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/spec/typeclasses/monoid.spec.ts#L17-L40) of a custom monoid to aggregate test run statistics and using `combineAll`



## Higher-Kinded Types
  ### Required to define advanced type classes

<i>What if we want to define a *single* typeclass instance which is parameterizable by a type parameter which itself might accept a type parameter,
but we do not want for this typeclass instance to care for that particular last type parameter before the actual methods of the typeclass are called?</i>
* Typescript does not support them yet ["Allow classes to be parametric in other parametric classes"](https://github.com/microsoft/TypeScript/issues/1213)
* Example: `Promise<T>` is a generic type, but `Promise` (or `Promise<~>` as per the proposal) is not a valid type in Typescript, in Scala it would
be called a "type constructor", `Promise` in this case is the missing higher-kinded type which does not exist in Typescript


## Higher-Kinded Types
  ### Emulating in Typescript
  * One possible way (similar to the [idea](https://gcanti.github.io/fp-ts/#higher-kinded-types) from [fp-ts](https://github.com/gcanti/fp-ts)) to emulate a higher-kinded type accepting one type parameter: [HKT](https://github.com/antivanov/functional-typescript/blob/main/src/typeclasses/hkt.ts), [usage](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/types/option.ts#L1-L14)
  * `fp-ts` emulates also higher-kinded types accepting more parameters and provides more utilities for working with them



## Monad
  ### Most important and frequently used typeclass

* A [type](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/monad.ts#L8-L14) which wraps a value and has operations `pure`, `flatMap` which satisfy certain [laws](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/spec/typeclasses/monad.spec.ts#L14-46)
* Given `pure` and `flatMap` it is possible to also implement `map` (which means that every "Monad" is also a "Functor")


## Monad
  * [Example](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/monad.ts#L16-L31): defining a typeclass instance for a new type, [Option](https://github.com/antivanov/functional-typescript/blob/main/src/typeclasses/types/option.ts)


## Monad
  * [Example](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/monad.ts#L34-L43): defining a typeclass instance for an existing type, [Promise](https://github.com/antivanov/functional-typescript/blob/main/src/typeclasses/types/promise.ts)
  * No implicit type conversions in Typescript => [typecasting](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/spec/typeclasses/monad.spec.ts#L72) when trying to tell Typescript to treat an existing type as an instance of a "higher-kinded type" we emulate


## Monad
  * More advanced Monad: [Reader](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/src/typeclasses/monad.ts#L58-L82), practical [example](https://github.com/antivanov/functional-typescript/blob/4fb0de20998ad49d966b77f2e5bff1a825a03e45/spec/typeclasses/monad.spec.ts#L85-L131) of injecting a database connection and chaining database operations



## Practical Monads
  * Not necessary to use a special library or define typeclasses in order to benefit from using monads, examples from [gen.js](https://github.com/antivanov/gen.js)
    - [Maybe](https://github.com/antivanov/gen.js/blob/master/src/maybe.ts) monad
    - [Generator](https://github.com/antivanov/gen.js/blob/master/src/generator.ts) monad:
      defining an ["identifier"](https://github.com/antivanov/gen.js/blob/aeeaabb79f5548509bd254b2cfcfe2a737e8e74c/src/generators/string.ts#L68-L76)
      or ["uuid"](https://github.com/antivanov/gen.js/blob/aeeaabb79f5548509bd254b2cfcfe2a737e8e74c/src/generators/string.ts#L81-L93)



## [fp-ts](https://github.com/gcanti/fp-ts): Functional Programming Library for Typescript
  * Inspired (like the code in this presentation) by Scala and [Cats](https://typelevel.org/cats/)
  * Both theoretically rigorous and practical library
  * Useful types and typeclasses are defined
  * `chain` instead of `flatMap`; `pipe`/`chain` calls is a very typical pattern in `fp-ts`
  * example of [`Either`](https://github.com/antivanov/functional-typescript/blob/main/src/fp-ts/either.example.ts), and chaining Monad calls
  * example of [form validation](https://github.com/antivanov/functional-typescript/blob/main/src/fp-ts/form.validation.example.ts)



## Typescript: not quite a functional language
  * Not the main goal of Typescript
  * Again no tail call optimization, although some [pleas](https://github.com/microsoft/TypeScript/issues/32743) to add it
  * No immutability, additional libraries are required, such as [Immutable.js](https://immutable-js.github.io/immutable-js/)
  * Coming more from the practical perspective: "how to add types to JavaScript in a backward-compatible manner"
  * However, still includes many useful features and can be used in a functional manner
  * But expands on the JavaScript's functional legacy and updates it


## Typescript: not quite a functional language
  ### Boiler-plate code when doing functional programming
  * Withot "return" statement function returns "undefined", more ephasis on being imperative language :(
  * Lots of braces and syntactic noise (C legacy from the old compiler days)
  * Missing higher-kinded types: i.e. "Promise" is not considered to be a separate type ("type constructor") in addition to "Promise<T>": need
    to cast types sometimes


## Typescript: not quite a functional language
  ### Boiler-plate code when doing functional programming
  * No way to define useful automatic conversions between types and related syntactic sugar: more boiler-plate
  * No way to define implicit values (in Scala, finally done right in Scala 3)
  * Some advanced type constructs, such as union types, but no type lambdas, for example
  * No pattern matching => type tag field in the Option implementation



## Q & A
  ### Thank you
