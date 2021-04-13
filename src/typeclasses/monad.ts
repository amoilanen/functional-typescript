import { Functor } from './functor';
import { Option_, Option, none } from './types/option';
import { Promise_, HKTPromise } from './types/promise';
import { Array_, HKTArray } from './types/array';
import { HKT } from './hkt';

// Monad is also a Functor as it is possible to implement "map" through "pure" and "flatMap"
export abstract class Monad<M> implements Functor<M> {
  abstract pure<A>(a: A): HKT<M, A>
  abstract flatMap<A, B>(fa: HKT<M, A>, f: (v: A) => HKT<M, B>): HKT<M, B>
  map<A, B>(fa: HKT<M, A>, f: (v: A) => B): HKT<M, B> {
    return this.flatMap(fa, (v: A) => this.pure<B>(f(v)));
  }
}

// It might be much more convenient to add map directly to the Option, however, for the illustration's sake defining a separate Functor typeclass
class OptionMonad extends Monad<Option_> {
  pure<A>(a: A): Option<A> {
    return Option.from(a);
  }
  flatMap<A, B>(fa: Option<A>, f: (v: A) => Option<B>): Option<B> {
    switch (fa.typeTag) {
      case 'None':
        return none;
      case 'Some':
        return f(fa.get())
    }
  }
}

const optionMonad: Monad<Option_> = new OptionMonad();

// Again it might be much more convenient to add map directly to Promise, however, for the illustration's sake defining a separate Functor typeclass
class PromiseMonad extends Monad<Promise_> {
  pure<A>(a: A): HKTPromise<A> {
    return Promise.resolve(a) as HKTPromise<A>;
  }
  flatMap<A, B>(fa: HKTPromise<A>, f: (v: A) => HKTPromise<B>): HKTPromise<B> {
    return fa.then(v => f(v)) as HKTPromise<B>;
  }
}

const promiseMonad: Monad<Promise_> = new PromiseMonad();

// The method "flatMap" already exists on an Array. adding it here again via a Functor just for the sake of illustration
class ArrayMonad extends Monad<Array_> {
  pure<A>(a: A): HKTArray<A> {
    return [ a ] as HKTArray<A>;
  }
  flatMap<A, B>(fa: HKTArray<A>, f: (v: A) => HKTArray<B>): HKTArray<B> {
    return fa.flatMap(f) as HKTArray<B>;
  }
}

const arrayMonad: Monad<Array_> = new ArrayMonad();

// Informally "ContextDependent<Ctx, unknown>" ~ "Ctx => unknown", i.e. "type constructor" for ContextDependent
export type ContextDependent_<Ctx> = () => Ctx

// Informally "ContextDependent<Ctx, R>" ~ "Ctx => R"
export interface ContextDependent<Ctx, R> extends HKT<ContextDependent_<Ctx>, R> {
  _F: ContextDependent_<Ctx>,
  _T: R
  (c: Ctx): R
}

/*
 * Compare with the Scala 3 version, because of Typescript not having higher kinded types, much more boiler-plate is needed
 * https://dotty.epfl.ch/docs/reference/contextual/type-classes.html#reader
 */
function readerMonad<Ctx>(): Monad<ContextDependent_<Ctx>> {
  return new class ReaderMonad<Ctx> extends Monad<ContextDependent_<Ctx>> {
    pure<A>(a: A): ContextDependent<Ctx, A> {
      return ((ctx: Ctx) => a) as ContextDependent<Ctx, A>;
    }
    flatMap<A, B>(fa: ContextDependent<Ctx, A>, f: (v: A) => ContextDependent<Ctx, B>): ContextDependent<Ctx, B> {
      return ((ctx: Ctx) => {
        return f(fa(ctx))(ctx);
      }) as ContextDependent<Ctx, B>;
    }
  };
}

export const MonadInstances = {
  optionMonad,
  promiseMonad,
  arrayMonad,
  readerMonad,
};
