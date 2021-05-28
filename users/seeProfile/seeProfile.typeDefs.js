import { gql } from 'apollo-server';

// graphql schema
export default gql`
  type Query {
    seeProfile(username: String!): User
  }
`;
