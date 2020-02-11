const CREATE_PIN = `
mutation($title:String!,$image:String!,$content:String!,$latitude:Float!,$longitude:Float!){
  CreatePin(input:{title:$title,image:$image,content:$content,latitude:$latitude,longitude:$longitude}){
    _id
    title
    image
    content
    latitude
    longitude
    author{
      _id
      name
      email
      picture
    }
  }
}
`;

const DELETE_PIN = `
  mutation($pin:ID!){
    deletePin(pinId:$pin){
      _id
    }
  }
`;

const ADD_COMMENT = `
  mutation($pinId:ID!,$text:String!){
    addComment(pinId:$pinId,text:$text){
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

export { CREATE_PIN, DELETE_PIN, ADD_COMMENT };
