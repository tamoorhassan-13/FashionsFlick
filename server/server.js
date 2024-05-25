import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/CategoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import "./config/db.js";
import passport from "passport";
import session from "express-session";
import { Strategy as OAuth2Strategy } from "passport-google-oauth2";
import userModel from "./models/userModel.js";
import path from "path";
import {
  googleLoginUserController,
  loginSuccessController,
} from "./controllers/googleLoginController.js";
// Configure environment variables
dotenv.config();
// Database config
connectDB();
// Create express app
const app = express();
// CORS middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

//setup session
app.use(
  session({
    secret: "abcjddhuueijdjsndsue3342343242",
    resave: false,
    saveUninitialized: true,
  })
);
//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new OAuth2Strategy(
    {
      clientID: process.env.GOOGLE_CLIENTID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ["profile", "email"],
    },
    googleLoginUserController
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});
//fetch user email from database
app.get("/users/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:3000/",
    failureRedirect: "http://localhost:3000/login",
  })
);

app.get("/login/success", loginSuccessController);

app.post("/logout/google", (req, res) => {
  // Invalidate session or JWT token
  // Optionally, clear user data from session or database

  res.status(200).json({ message: "Logged out successfully" });
});

// Your route handlers

app.use(express.json());
app.use(morgan("dev"));

app.use(express.static(path.join(process.cwd(), "client", "build")));

// app.use(express.static(path.join(__dirname, "../client/build")));
// Routes
app.use("/auth", authRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
// REST API
app.use("*", function (req, res) {
  res.sendFile(path.join(process.cwd(),"client/build","index.html"));
});
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to e-commerce app",
  });
});
// Port
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log(
    `Express server is running on ${process.env.DEV_MODE} mode on ${port}`
      .bgWhite.black
  );
});
