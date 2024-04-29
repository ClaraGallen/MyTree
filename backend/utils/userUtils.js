const User = require("../models/User");

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getUserById,
};
