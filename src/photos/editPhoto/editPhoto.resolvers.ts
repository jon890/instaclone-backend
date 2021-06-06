import { Resolvers } from '../../type';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const resolvers: Resolvers = {
  Mutation: {
    editPhoto: protectedResolver(
      async (_, { id, caption }, { loggedInUser, client }) => {
        const oldPhoto = await client.photo.findFirst({
          where: {
            id,
            userId: loggedInUser.id,
          },
          include: {
            hashtags: {
              select: {
                hashtag: true,
              },
            },
          },
        });

        if (!oldPhoto) {
          return {
            ok: false,
            error: 'Photo not found',
          };
        }

        console.log(oldPhoto);

        await client.photo.update({
          where: {
            id,
          },
          data: {
            caption,
            hashtags: {
              // 기존 해시태그 연결을 제거한다
              disconnect: oldPhoto.hashtags,
              connectOrCreate: processHashtags(caption),
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
