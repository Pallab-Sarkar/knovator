module.exports.prepareUserResponse = function (user) {
  user._doc ? delete user._doc.otp : delete user.otp;
  user._doc ? delete user._doc.createdAt : delete user.createdAt;
  user._doc ? delete user._doc.password : delete user.password;
  user._doc ? delete user._doc.token : delete user.token;
  user._doc ? delete user._doc.__v : delete user.__v;

  return user._doc ? user._doc : user;
};

module.exports.handleError = (res) => (error) => {
  console.log(error);
  res.status(error.status || 400).json(error);
};
