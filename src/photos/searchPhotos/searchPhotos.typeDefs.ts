import { gql } from 'apollo-server';

// todo pagination
export default gql`
  type Query {
    searchPhotos(keyword: String!): [Photo]
  }
`;
