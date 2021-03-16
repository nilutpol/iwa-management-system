const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const SALT_WORK_FACTOR = 12;

let UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  first_name: String,
  last_name: String,
  user_access: String,
  updated_at: Date,
  disabled: {
    type: Boolean,
    default: false
  }
});

UserSchema.pre('save', function (next) {
  let user = this;

  user.updated_at = new Date();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};


module.exports = mongoose.model("user", UserSchema);
