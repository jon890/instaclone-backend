import * as jwt from 'jsonwebtoken';
import client from '../client';
import { Resolver } from '../type';

export const getUser = async (token) => {
  try {
    if (!token) {
      return null;
    }

    // token verify
    const verifiedToken : any = await jwt.verify(token, process.env.PRIVATE_KEY);
    if ("id" in verifiedToken) {
      const user = await client.user.findUnique({ where: { id: verifiedToken["id"] } });
      if (user) {
        return user;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};

export const protectedResolver = (ourResolver: Resolver) => (
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
