/*
 * Port of the example for Cats Either https://typelevel.org/cats/datatypes/either.html to fp-ts
 */
import { Either, chain, left, right } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable'

function parse(s: string): Either<Error, number> {
  if (s.match(/-?[0-9]+/)) {
    return right(parseInt(s, 10));
  } else {
    return left(new Error(`'${s}' is not an integer`));
  }
}

function reciprocal(n: number): Either<Error, number> {
  if (n == 0) {
    return left(new Error(`Illegal attempt to divide by '${n}'`));
  } else {
    return right(1 / n);
  }
}

function findReciprocal(s: string): Either<Error, number> {
  return pipe(
    parse(s),
    chain(reciprocal) // "chain" is how "flatMap" is implemented in fp-ts, just arguments are inversed
  );
}

console.log(findReciprocal('3'));
console.log(findReciprocal('0'));
console.log(findReciprocal(''));