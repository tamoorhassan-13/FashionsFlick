import userdb from "../models/userModelForGoogleLogin.js";
import JWT  from "jsonwebtoken";

export const googleLoginUserController = async (
  accessToken,
  refreshToken,
  profile,
  done
) => {
  try {
    let user = await userdb.findOne({ googleId: profile.id });
    if (!user) {
      user = new userdb({
        googleId: profile.id,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      });
      await user.save();
    }

    // You can return user data directly to the client or use sessions for authentication

    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
};

export const loginSuccessController = async (req, res) => {
  try {
    if (req.user) {
      console.log("Logged in user:", req.user);
      const token = await JWT.sign(
        {
          _id: req.user.googleId,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "7d" }
      );
      res
        .status(200)
        .json({ message: "User logged in", user: req.user, token: token });
    } else {
      res.status(400).json({ message: "User not authorized" });
    }
  } catch (error) {
    console.error("Error in loginSuccessController:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
