import client from '../../client';
import { protectedResolver } from '../users.utils';

export default {
  Mutation: {
    followUser: protectedResolver(async (_, { username }, { loggedInUser }) => {
      // follow 하려는 user가 존재하는지 확인
      const ok = await client.user.findUnique({ where: { username } });
      if (!ok) {
        return { ok: false, error: 'That user does not exist.' };
      }

      await client.user.update({
        where: { id: loggedInUser.id },
        data: {
          following: {
            connect: {
              // unique field로 connect할 수 있다
              // 존재하지 않는 username 이라면..?
              username,
            },
          },
        },
      });

      return {
        ok: true,
      };
    }),
  },
};
