const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.OAUTH_CLIENT_ID);

exports.findOneOrUpdate = async token => {
  const googleUser = await verifyAuthUser(token);
  const user = await checkIfUserExists(googleUser.email);
  return user ? user : createNewUser(googleUser);
};

async function verifyAuthUser(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.OAUTH_CLIENT_ID
    });
    return ticket.payload;
  } catch (error) {
    console.log(error.message);
  }
}

async function checkIfUserExists(email) {
  try {
    return await User.findOne({ email }).exec();
  } catch (error) {
    console.log(error.message);
  }
}

async function createNewUser(googleUser) {
  const { name, email, picture } = googleUser;
  const user = { name, email, picture };
  try {
    return await new User(user).save();
  } catch (error) {
    console.log(error.message);
  }
}
