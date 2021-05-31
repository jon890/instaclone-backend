import client from '../../client';

export default {
  Query: {
    seeFollowers: async (_, { username, page }) => {
      const ok = await client.user.findUnique({
        where: { username },
        select: { id: true },
      });

      if (!ok) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // 방법1 - 해당 유저를 찾고 그의 팔로워들을 찾는다
      const aFollowers = await client.user
        .findUnique({ where: { username } })
        .followers({
          take: 5,
          skip: (page - 1) * 5,
        });

      // 방법2 - 해당 유저를 팔로잉하는 유저들을 찾는다
      //   const bFollowers = await client.user.findMany({
      //     where: {
      //       following: {
      //         some: {
      //           username,
      //         },
      //       },
      //     },
      //   });
      //   console.log(bFollowers);

      const totalFollowers = await client.user.count({
        where: { following: { some: { username } } },
      });

      return {
        ok: true,
        followers: aFollowers,
        totalPages: Math.ceil(totalFollowers / 5),
      };
    },
  },
};
