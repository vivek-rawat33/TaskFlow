import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        //  Find user by Google ID
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          //  If not found, check if a local account with the same email exists
          user = await User.findOne({
            email: profile.emails[0].value,
          });

          if (user) {
            //  Link Google account to existing user
            user.googleId = profile.id;
            user.avatar = profile.photos?.[0]?.value || user.avatar;
            user.authProvider = "google";

            await user.save();
          } else {
            //  Create a new Google account
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatar: profile.photos?.[0]?.value || "",
              authProvider: "google",
            });
          }
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);
