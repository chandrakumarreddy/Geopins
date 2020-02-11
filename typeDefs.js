const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    _id: ID
    name: String
    email: String
    picture: String
  }

  type Comment {
    text: String
    createdAt: String
    author: User
  }

  type Pin {
    _id: ID
    createdAt: String
    title: String
    content: String
    image: String
    latitude: Float
    longitude: Float
    author: User
    comments: [Comment]
  }

  input createInputPin {
    title: String!
    image: String!
    content: String!
    latitude: Float!
    longitude: Float!
  }

  type Query {
    me: User
    getPins: [Pin!]
  }

  type Mutation {
    CreatePin(input: createInputPin!): Pin
    deletePin(pinId: ID!): Pin
    addComment(pinId: ID!, text: String!): Pin
  }

  type Subscription {
    pinAdded: Pin
    pinDeleted: Pin
    pinUpdated: Pin
  }
`;
