// Enhanced Reward Points System
import { storage } from "./storage";
import { db } from "./db";
import { users, rewardActivities, dailyLogins, friendReferrals, blogPosts, blogViews } from "@shared/schema";
import { eq, and, gte, desc, count } from "drizzle-orm";

export const REWARD_POINTS = {
  FRIEND_REFERRAL: 20,
  BLOG_READ: 5,
  BLOG_WRITE: 50,
  DAILY_LOGIN: 5,
  PROFILE_COMPLETE: 50,
  JOB_APPLICATION: 10,
} as const;

export class RewardPointsService {
  // Award points for friend referral completion
  async awardFriendReferralPoints(referrerId: number, referredUserId: number) {
    try {
      // Update friend referral status
      await db.update(friendReferrals)
        .set({ 
          referredUserId, 
          status: 'completed', 
          pointsAwarded: REWARD_POINTS.FRIEND_REFERRAL,
          completedAt: new Date() 
        })
        .where(eq(friendReferrals.referrerId, referrerId));

      // Award points to referrer
      await this.awardPoints(referrerId, REWARD_POINTS.FRIEND_REFERRAL, 'friend_refer', `Friend referral completed`);
      
      return true;
    } catch (error) {
      console.error('Error awarding friend referral points:', error);
      return false;
    }
  }

  // Award points for blog reading
  async awardBlogReadPoints(userId: number, blogId: number) {
    try {
      // Check if user already read this blog today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingView = await db.select()
        .from(blogViews)
        .where(and(
          eq(blogViews.userId, userId),
          eq(blogViews.blogId, blogId),
          gte(blogViews.viewedAt, today)
        ))
        .limit(1);

      if (existingView.length === 0) {
        // Record blog view
        await db.insert(blogViews).values({
          blogId,
          userId,
          viewedAt: new Date()
        });

        // Update blog view count
        await db.update(blogPosts)
          .set({ viewCount: (await db.select({ count: count() }).from(blogViews).where(eq(blogViews.blogId, blogId)))[0].count })
          .where(eq(blogPosts.id, blogId));

        // Award points for reading
        await this.awardPoints(userId, REWARD_POINTS.BLOG_READ, 'blog_read', `Read a blog post`);
      }
      
      return true;
    } catch (error) {
      console.error('Error awarding blog read points:', error);
      return false;
    }
  }

  // Award points for blog writing
  async awardBlogWritePoints(userId: number, blogId: number) {
    try {
      await this.awardPoints(userId, REWARD_POINTS.BLOG_WRITE, 'blog_write', `Published a blog post`);
      return true;
    } catch (error) {
      console.error('Error awarding blog write points:', error);
      return false;
    }
  }

  // Award daily login points (once per day)
  async awardDailyLoginPoints(userId: number) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Check if user already got login points today
      const todayLogin = await db.select()
        .from(dailyLogins)
        .where(and(
          eq(dailyLogins.userId, userId),
          gte(dailyLogins.loginDate, today)
        ))
        .limit(1);

      if (todayLogin.length === 0) {
        // Record daily login
        await db.insert(dailyLogins).values({
          userId,
          loginDate: new Date(),
          pointsAwarded: REWARD_POINTS.DAILY_LOGIN
        });

        // Award login points
        await this.awardPoints(userId, REWARD_POINTS.DAILY_LOGIN, 'daily_login', `Daily login bonus`);
      }
      
      return true;
    } catch (error) {
      console.error('Error awarding daily login points:', error);
      return false;
    }
  }

  // Award profile completion points
  async awardProfileCompletePoints(userId: number) {
    try {
      // Check if user already got profile completion points
      const existingActivity = await db.select()
        .from(rewardActivities)
        .where(and(
          eq(rewardActivities.userId, userId),
          eq(rewardActivities.activityType, 'profile_complete')
        ))
        .limit(1);

      if (existingActivity.length === 0) {
        await this.awardPoints(userId, REWARD_POINTS.PROFILE_COMPLETE, 'profile_complete', `Profile completion bonus`);
      }
      
      return true;
    } catch (error) {
      console.error('Error awarding profile complete points:', error);
      return false;
    }
  }

  // Core method to award points
  private async awardPoints(userId: number, points: number, activityType: string, description: string) {
    try {
      // Record the activity
      await db.insert(rewardActivities).values({
        userId,
        activityType,
        points,
        description,
        createdAt: new Date()
      });

      // Update user's total points
      const currentUser = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (currentUser.length > 0) {
        const newPoints = (currentUser[0].rewardPoints || 0) + points;
        await db.update(users)
          .set({ rewardPoints: newPoints })
          .where(eq(users.id, userId));
      }

      return true;
    } catch (error) {
      console.error('Error awarding points:', error);
      return false;
    }
  }

  // Get user's reward activities
  async getUserActivities(userId: number, limit = 20) {
    try {
      return await db.select()
        .from(rewardActivities)
        .where(eq(rewardActivities.userId, userId))
        .orderBy(desc(rewardActivities.createdAt))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      return [];
    }
  }

  // Get leaderboard
  async getLeaderboard(limit = 10) {
    try {
      return await db.select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        rewardPoints: users.rewardPoints
      })
        .from(users)
        .where(eq(users.role, 'candidate'))
        .orderBy(desc(users.rewardPoints))
        .limit(limit);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return [];
    }
  }
}

export const rewardPointsService = new RewardPointsService();