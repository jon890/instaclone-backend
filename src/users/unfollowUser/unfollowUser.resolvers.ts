import { Resolvers } from '../../type';
import { protectedResolver } from '../users.utils';

const resolvers: Resolvers = {
  Mutation: {
    unfollowUser: protectedResolver(
      async (_, { username }, { loggedInUser, client }) => {
        const ok = await client.user.findUnique({ where: { username } });
        if (!ok) {
          return { ok: false, error: `Target user doesn't exist` };
        }

        await client.user.update({
          where: {
            id: loggedInUser.id,
          },
          data: {
            following: {
              disconnect: {
                username,
              },
            },
          },
        });

        return {
          ok: true,
        };
      },
    ),
  },
};

export default resolvers;