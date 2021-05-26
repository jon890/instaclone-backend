import { gql } from "apollo-server";

export default gql`
  type Movie {
    id: Int!
    title: String!
    genre: String
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    movies: [Movie]
    movie(id: Int!): Movie
  }

  type Mutation {
    createMovie(title: String!, genre: String): Movie
    updateMovie(id: Int!, title: String, genre: String): Movie
    deleteMovie(id: Int!): Movie
  }
`;
