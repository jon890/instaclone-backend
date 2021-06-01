import { createWriteStream } from 'fs';
import bcrypt from 'bcrypt';
import { protectedResolver } from '../users.utils';
import { Resolver, Resolvers } from '../../type';

const resolverFn: Resolver = async (
  _,
  { firstName, lastName, username, email, bio, avatar, password: newPassword },
  { loggedInUser, client },
) => {
  let avatarUrl = null;
  if (avatar) {
    const { filename, createReadStream } = await avatar;
    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`;
    const readStream = createReadStream();
    const writeStream = createWriteStream(
      process.cwd() + '/uploads/' + newFilename,
    );
    readStream.pipe(writeStream);
    avatarUrl = `http://localhost:4000/static/${newFilename}`;
  }

  let uglyPassword = null;
  if (newPassword) {
    uglyPassword = await bcrypt.hash(newPassword, 10);
  }

  const updatedUser = await client.user.update({
    where: { id: loggedInUser.id },
    data: {
      firstName,
      lastName,
      username,
      email,
      bio,
      // es6 synthetic sugar
      // 변경할 비밀번호를 받으면 => 해쉬를하여 어글리 패스워드를 만들고
      // 어글리 패스워드가 있다면 변경할 필드에 추가한다
      ...(uglyPassword && { password: uglyPassword }),
      ...(avatarUrl && { avatar: avatarUrl }),
    },
  });

  if (updatedUser.id) {
    return { ok: true, error: null };
  } else {
    return { ok: false, error: 'Could not update profile' };
  }
};

const resolvers : Resolvers =  {
  Mutation: {
    editProfile: protectedResolver(resolverFn),
  },
};

export default resolvers;