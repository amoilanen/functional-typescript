import { expect } from 'chai';

import { HKT } from '../../src/typeclasses/hkt';
import { Monad, MonadInstances, ContextDependent_, ContextDependent } from '../../src/typeclasses/monad';
import { Option } from '../../src/typeclasses/types/option';

describe('monad', () => {

  class Eq {
    static async expectEql<T>(message: string, x: T, y :T): Promise<void> {
      if (x instanceof Function) {
        expect(x.toString(), message).to.eql(y.toString());
      } else if (x instanceof Promise) {
        expect(await x, message).to.eql(y);
      } else {
        expect(x, message).to.eql(y);
      }
    }
  }

  describe('monad laws', () => {

    function checkMonadLaws<M, A, B, C>(m: Monad<M>, a: A, fa: HKT<M, A>, g: (v: A) => HKT<M, B>, h: (v: B) => HKT<M, C>): void {
      it(`${m.constructor.name} should satisfy monad laws`, async () => {
        await checkAssociativityLaw(m, fa, g, h);
        await checkIdentityLaw(m, a, fa, g);
      });
    }

    async function checkAssociativityLaw<M, A, B, C>(m: Monad<M>, fa: HKT<M, A>, g: (v: A) => HKT<M, B>, h: (v: B) => HKT<M, C>): Promise<void> {
      await Eq.expectEql(
        `associativity law for ${m.constructor.name}`,
        m.flatMap(m.flatMap(fa, g), h),
        m.flatMap(fa, x => m.flatMap(g(x), h))
      );
    }

    async function checkIdentityLaw<M, A, B>(m: Monad<M>, a: A, fa: HKT<M, A>, g: (v: A) =>HKT<M, B>): Promise<void> {
      await Eq.expectEql(
        `left identity law for ${m.constructor.name}`,
        m.flatMap(m.pure(a), g),
        g(a)
      );
      await Eq.expectEql(
        `right identity law for ${m.constructor.name}`,
        m.flatMap(fa, m.pure),
        fa
      );
    }

    checkMonadLaws(MonadInstances.optionMonad, "a", Option.from("a"), s => Option.from(s.length), n => Option.from(`${n}_letters`));

    type StringDependent<T> = ContextDependent<string, T>
    checkMonadLaws(
      MonadInstances.readerMonad<string>(),
      2,
      ((s: string) => 2) as StringDependent<number>,
      (n: number) => ((s: string) => Math.abs(n)) as StringDependent<number>,
      (n: number) => ((s: string) => n > s.length) as StringDependent<boolean>
    );
  });

  describe('Reader monad example: dependency injection', () => {

    interface Connection {}
    type ConnectionDependent_ = ContextDependent_<Connection>
    type ConnectionDependent<T> = ContextDependent<Connection, T>

    interface UserId {}
    class User {
      constructor(readonly id: UserId, public name: string) {}
    }
    class UserDao {
      // Might also use Option here to avoid dealing with null values
      persistedUser: User = null
      insertUser(user: User): ConnectionDependent<void> {
        return ((connection: Connection) => { this.persistedUser = user }) as ConnectionDependent<void>;
      }
      updateUser(userId: UserId, name: string): ConnectionDependent<void> {
        return ((connection: Connection) => { this.persistedUser.name = name }) as ConnectionDependent<void>;
      }
      getUser(userId: UserId): ConnectionDependent<User> {
        return ((connection: Connection) => {
          return this.persistedUser;
        }) as ConnectionDependent<User>;
      }
    }

    it('should allow to pass context seemlessly', async () => {
      const connection = {} as Connection;
      const userId = "UserId";
      const userName = "UserName";
      const userNameUpdated = "UserNameUpdated"
      const user = new User(userId, userName)

      let dao = new UserDao();
      let m: Monad<ConnectionDependent_> = MonadInstances.readerMonad<Connection>();

      /*
       * Now using the Reader monad it is possible to compose database operations together
       */
      let compositeDaoOperation: ConnectionDependent<User> = m.flatMap(dao.insertUser(user), _ =>
        m.flatMap(dao.updateUser(userId, userNameUpdated), _ =>
          dao.getUser(userId)
        )
      ) as ConnectionDependent<User>;

      expect(compositeDaoOperation(connection)).to.eql(new User(userId, userNameUpdated));
    });
  });
});