import client from "../client";

export default {
  Mutation: {
    createMovie: (_, { title, genre }) =>
      client.movie.create({
        data: {
          title,
          genre,
        },
      }),
    updateMovie: (_, { id, title, genre }) =>
      client.movie.update({
        where: { id },
        data: {
          title,
          genre,
        },
      }),
    deleteMovie: (_, { id }) => client.movie.delete({ where: { id } }),
  },
};
