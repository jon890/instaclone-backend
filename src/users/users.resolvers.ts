import client from '../client';
import { Resolvers } from '../type';

const resolvers: Resolvers = {
  // Computed Fields
  // type User의 각 필드에 대한 resolver를 정의할 수 있다
  User: {
    totalFollowing: ({ id }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }) =>
      client.user.count({
        where: {
          following: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      return id === loggedInUser.id;
    },
    isFollowing: async ({ id }, _, { loggedInUser }) => {
      if (!loggedInUser) {
        return false;
      }

      //   const exists = await client.user
      //     .findUnique({
      //       where: {
      //         username: loggedInUser.username,
      //       },
      //     })
      //     .following({
      //       where: {
      //         id,
      //       },
      //     });

      //   return exists.length !== 0;

      const exists = await client.user.count({
        where: {
          username: loggedInUser.username,
          following: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
  },
};

export default resolvers;
