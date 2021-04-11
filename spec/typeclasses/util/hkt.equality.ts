import { HKT } from '../../../src/typeclasses/hkt';
import * as deepEql from 'deep-eql';

export interface HKTEquality<M> {
  equal<T>(x: HKT<M, T>, y: HKT<M, T>): boolean
}

class DeepEquality<M> implements HKTEquality<M> {
  equal<T>(x: HKT<M, T>, y: HKT<M, T>): boolean {
    return deepEql(x, y);
  }
}

export function deepEquality<M>(): HKTEquality<M> {
  return new DeepEquality<M>();
}