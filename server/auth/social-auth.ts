import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { storage } from '../storage';
import type { User } from '@shared/schema';

export const setupSocialAuth = () => {
  // Only setup strategies if environment variables are provided
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    // Google OAuth Strategy
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this Google ID
    let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (user) {
      // User exists, update their Google info if needed
      return done(null, user);
    }
    
    // Create new user from Google profile
    const newUser = await storage.createUser({
      email: profile.emails?.[0]?.value || '',
      password: '', // Social login users don't have passwords
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
    });
    
    return done(null, newUser);
    } catch (error) {
      return done(error, undefined);
    }
    }));
  }

  if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
    // LinkedIn OAuth Strategy
    passport.use(new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "/api/auth/linkedin/callback",
      scope: ['r_emailaddress', 'r_liteprofile']
    }, async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists with this LinkedIn email
    let user = await storage.getUserByEmail(profile.emails?.[0]?.value || '');
    
    if (user) {
      // User exists, return them
      return done(null, user);
    }
    
    // Create new user from LinkedIn profile
    const newUser = await storage.createUser({
      email: profile.emails?.[0]?.value || '',
      password: '', // Social login users don't have passwords
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
    });
    
    return done(null, newUser);
    } catch (error) {
      return done(error, undefined);
    }
    }));
  }

  // Serialize user for the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};