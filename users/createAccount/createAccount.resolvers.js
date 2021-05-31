import bcrypt from 'bcrypt';
import client from '../../client';

export default {
  Mutation: {
    createAccount: async (
      _,
      { firstName, lastName, username, email, password },
    ) => {
      try {
        // 이미 이메일과 닉네임이 있는지 확인하기
        const existingUser = await client.user.findFirst({
          where: {
            OR: [
              {
                username,
              },
              {
                email,
              },
            ],
          },
        });
        console.log(existingUser);

        if (existingUser) {
          throw new Error('This username/password is already taken.');
        }

        // 비밀번호 해쉬화
        const uglyPassword = await bcrypt.hash(password, 10);
        console.log(uglyPassword);

        // 저장하고 유저를 리턴하기
        await client.user.create({
          data: {
            username,
            email,
            firstName,
            lastName,
            password: uglyPassword,
          },
        });
        return { ok: true };
      } catch (error) {
        console.log(error);
        return { ok: false, error: "Can't create account" };
      }
    },
  },
};
