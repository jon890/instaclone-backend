import { Resolver, Resolvers } from '../../type';
import { protectedResolver } from '../../users/users.utils';
import { processHashtags } from '../photos.utils';

const uploadPhotoResolver: Resolver = (
  _,
  { file, caption },
  { loggedInUser, client },
) => {
  let hashtagObjs = [];
  if (caption) {
    hashtagObjs = processHashtags(caption);
  }

  // save the photo WITH the parsed hashtags
  // add the photo to the hashtags
  return client.photo.create({
    data: {
      file,
      caption,
      user: {
        connect: {
          id: loggedInUser.id,
        },
      },
      ...(hashtagObjs.length > 0 && {
        hashtags: {
          connectOrCreate: hashtagObjs,
        },
      }),
    },
  });
};

const resolvers: Resolvers = {
  Mutation: {
    uploadPhoto: protectedResolver(uploadPhotoResolver),
  },
};

export default resolvers;
