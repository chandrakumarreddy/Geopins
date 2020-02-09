const { AuthenticationError } = require("apollo-server");

const authenticated = next => (root, args, cxt, info) => {
  if (!cxt.currentUser) {
    throw new AuthenticationError("login falied");
  }
  return next(root, args, cxt, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, cxt) => cxt.currentUser)
  }
};
