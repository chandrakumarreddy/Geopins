const { AuthenticationError, PubSub } = require("apollo-server");
const Pin = require("./models/pins");

const pubSub = new PubSub();
const PIN_ADDED = "PIN_ADDED";
const PIN_DELETED = "PIN_DELETED";
const PIN_UPDATED = "PIN_UPDATED";

const authenticated = next => (root, args, cxt, info) => {
  if (!cxt.currentUser) {
    throw new AuthenticationError("login falied");
  }
  return next(root, args, cxt, info);
};

module.exports = {
  Query: {
    me: authenticated((root, args, cxt) => cxt.currentUser),
    getPins: async () => {
      return await Pin.find({})
        .populate("author")
        .populate("comments.author");
    }
  },
  Mutation: {
    CreatePin: authenticated(async (root, args, cxt) => {
      const newPin = await Pin({
        ...args.input,
        author: cxt.currentUser._id
      }).save();
      const pinAdded = await Pin.populate(newPin, "author");
      pubSub.publish(PIN_ADDED, { pinAdded });
      return pinAdded;
    }),
    deletePin: authenticated(async (root, args, cxt) => {
      const pinDeleted = await Pin.findOneAndDelete({ _id: args.pinId }).exec();
      pubSub.publish(PIN_DELETED, { pinDeleted });
      return pinDeleted;
    }),
    addComment: authenticated(async (root, { pinId, text }, cxt) => {
      const newComment = { text, author: cxt.currentUser._id };
      const newPin = await Pin.findOneAndUpdate(
        { _id: pinId },
        { $push: { comments: newComment } },
        { new: true }
      );
      const pinUpdated = newPin.populate("author").populate("comments.author");
      pubSub.publish(PIN_UPDATED, { pinUpdated });
      return pinUpdated;
    })
  },
  Subscription: {
    pinAdded: {
      subscribe: () => pubSub.asyncIterator(PIN_ADDED)
    },
    pinDeleted: {
      subscribe: () => pubSub.asyncIterator(PIN_DELETED)
    },
    pinUpdated: {
      subscribe: () => pubSub.asyncIterator(PIN_UPDATED)
    }
  }
};
