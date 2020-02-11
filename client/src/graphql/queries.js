const ME_QUERY = `
  query {
      me {
      _id
      name
      picture
    }
  }
`;

const GET_PINS = `
query{getPins{
    _id
    createdAt
    title
    content
    image
    latitude
    longitude
    author{
      _id
      name
      picture
    }
    comments{
      text
      createdAt
      author{
        _id
        name
        picture
      }
    }
  }
}
`;

export { ME_QUERY, GET_PINS };
