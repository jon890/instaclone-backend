import jwt from 'jsonwebtoken';
import client from '../client';

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }

    // token verify
    const { id } = await jwt.verify(token, process.env.PRIVATE_KEY);
    const user = await client.user.findUnique({ where: { id } });
    if (user) {
      return user;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const protectedResolver = (ourResolver) => (
  root,
  args,
  context,
  info,
) => {
  //   console.log(`protectedResolver!!`);
  //   console.log('context', context);

  if (!context.loggedInUser) {
    return {
      ok: false,
      error: 'Please log in to perform this action',
    };
  }
  return ourResolver(root, args, context, info);
};
