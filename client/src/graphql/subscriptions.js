import gql from "graphql-tag";

export const PIN_ADDED = gql`
  subscription {
    pinAdded {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;

export const PIN_DELETED = gql`
  subscription {
    pinDeleted {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;

export const PIN_UPDATED = gql`
  subscription {
    pinUpdated {
      _id
      createdAt
      title
      content
      image
      latitude
      longitude
      author {
        _id
        name
        picture
      }
      comments {
        text
        createdAt
        author {
          _id
          name
          picture
        }
      }
    }
  }
`;
