import mongoose from "mongoose";

const userModelForGoogleLogin = new mongoose.Schema(
  {
    googleId: {
      type: String,
    },
    displayName: {
      type: String,
    },
    email: {
      type: String,
    },
    image: {
      type: String,
    },
    address: {
      type:String
    },
  },
  { timestamps: true }
);
const userdb = mongoose.model("usersLoginWithGoogle", userModelForGoogleLogin);

export default userdb;
