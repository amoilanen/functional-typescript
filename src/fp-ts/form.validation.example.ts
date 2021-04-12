/*
 * Adaptation of the example from https://dev.to/gcanti/getting-started-with-fp-ts-either-vs-validation-5eja
 */
import { sequenceT, Apply2C } from 'fp-ts/lib/Apply'
import { Either, URI as EitherHKT, left, right, map, mapLeft, getValidation, chain } from 'fp-ts/lib/Either'
import { getSemigroup, NonEmptyArray } from 'fp-ts/lib/NonEmptyArray'
import { pipe } from 'fp-ts/lib/pipeable'

// https://developer.mozilla.org/en-US/docs/Learn/Forms/Your_first_form
class ContactForm {
  constructor(readonly name: string, readonly email: string, readonly message: string) {}
}

class FormValidationError {
  constructor(readonly fieldName: string, readonly value: string, readonly message: string) {}
}

function minLength(fieldName: string, len: number): (s: string) => Either<FormValidationError, string> {
  return (s: string) => s.length >= len ? right(s) : left(new FormValidationError(fieldName, s, `should be no shorter than ${len} characters`));
}
function maxLength(fieldName: string, len: number): (s: string) => Either<FormValidationError, string> {
  return (s: string) => s.length <= len ? right(s) : left(new FormValidationError(fieldName, s, `should be no longer than ${len} characters`));
}
function email(fieldName: string): (s: string) => Either<FormValidationError, string> {
  return (s: string) => s.indexOf('@') >0 ? right(s) : left(new FormValidationError(fieldName, s, `is not an email`));
}

function lift<E, A>(check: (a: A) => Either<E, A>): (a: A) => Either<NonEmptyArray<E>, A> {
  return a =>
    pipe(
      check(a),
      mapLeft(a => [a])
    );
}

// Defining a way to combine the validation errors, i.e. "FormValidationError"s, for this a NonEmptyArray Semigroup is needed
const applicativeValidation: Apply2C<EitherHKT, NonEmptyArray<FormValidationError>> = getValidation(getSemigroup<FormValidationError>());

function validateForm(form: ContactForm): Either<NonEmptyArray<FormValidationError>, ContactForm> {
  return pipe(
    sequenceT(applicativeValidation)(
      lift(minLength('name', 2))(form.name),
      lift(email('email'))(form.email),
      lift(maxLength('message', 256))(form.message)
    ),
    map(() => form)
  )
}

const invalidForm = new ContactForm('x', 'abc', 'Test message');
const validForm = new ContactForm('Matti Meikäläinen', 'matti.meikäläinen@gmail.com', 'Terve, olen Matti, haluaisin kysyä yhtä juttua...')

console.log(validateForm(invalidForm));
console.log(validateForm(validForm));
