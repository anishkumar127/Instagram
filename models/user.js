const mongoose = require("mongoose");

const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  followers: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
  resetToken: String,
  expireToken: Date,

  pic: {
    type: String,
    default:
      "https://res.cloudinary.com/anishbishnoi/image/upload/v1615141855/esdxs4jy18p9idofjmt8.jpg",
  },
  following: [
    {
      type: ObjectId,
      ref: "User",
    },
  ],
});

mongoose.model("User", userSchema);
