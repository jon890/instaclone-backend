import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import client from '../../client';

export default {
  Mutation: {
    login: async (_, { username, password }) => {
      // 유저네임 확인
      const user = await client.user.findFirst({ where: { username } });
      if (!user) {
        return { ok: false, error: 'User not found.' };
      }

      // 비밀번호 확인
      const passwordOk = await bcrypt.compare(password, user.password);
      console.log(`login : passwordCompare : ${passwordOk}`);
      if (!passwordOk) {
        return { ok: false, error: 'Incorrect password' };
      }

      // 토큰을 발행하고 리턴한다
      const token = await jwt.sign({ id: user.id }, process.env.PRIVATE_KEY);
      return {
        ok: true,
        token,
      };
    },
  },
};
