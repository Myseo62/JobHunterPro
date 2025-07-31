import { db } from "./db";
import { users, rewardActivities, rewardRedemptions } from "@shared/schema";
import { eq, desc, sum } from "drizzle-orm";
import type { InsertRewardActivity, InsertRewardRedemption } from "@shared/schema";

// Reward point values for different activities
export const REWARD_POINTS = {
  BLOG_READ: 5,
  BLOG_WRITE: 50,
  PROFILE_COMPLETE: 100,
  FRIEND_REFER: 200,
  JOB_APPLICATION: 10,
  RESUME_UPLOAD: 25,
  SKILL_ADD: 15,
  COMPANY_FOLLOW: 5,
  JOB_SAVE: 2,
  DAILY_LOGIN: 3,
  PROFILE_UPDATE: 10,
} as const;

// Available reward redemptions
export const REWARD_CATALOG = {
  PREMIUM_JOB_ALERTS: { points: 500, duration: '30 days', description: 'Get premium job alerts for 30 days' },
  FEATURED_PROFILE: { points: 300, duration: '7 days', description: 'Feature your profile for 7 days' },
  RESUME_BOOST: { points: 200, duration: '14 days', description: 'Boost your resume visibility for 14 days' },
  PRIORITY_SUPPORT: { points: 150, duration: '30 days', description: 'Get priority customer support for 30 days' },
  CAREER_CONSULTATION: { points: 1000, duration: 'one-time', description: 'One-on-one career consultation session' },
  SKILL_CERTIFICATION: { points: 800, duration: 'one-time', description: 'Free skill certification course' },
} as const;

export class RewardService {
  // Award points to a user for completing an activity
  static async awardPoints(
    userId: number, 
    activityType: keyof typeof REWARD_POINTS, 
    customPoints?: number
  ): Promise<void> {
    const points = customPoints || REWARD_POINTS[activityType];
    const description = this.getActivityDescription(activityType, points);

    try {
      // Start a transaction to ensure data consistency
      await db.transaction(async (tx) => {
        // Record the activity
        await tx.insert(rewardActivities).values({
          userId,
          activityType,
          points,
          description,
        });

        // Update user's total points
        const [currentUser] = await tx
          .select({ rewardPoints: users.rewardPoints })
          .from(users)
          .where(eq(users.id, userId));

        const newTotal = (currentUser?.rewardPoints || 0) + points;
        
        await tx
          .update(users)
          .set({ rewardPoints: newTotal })
          .where(eq(users.id, userId));
      });

      console.log(`Awarded ${points} points to user ${userId} for ${activityType}`);
    } catch (error) {
      console.error('Error awarding points:', error);
      throw error;
    }
  }

  // Get user's reward activities history
  static async getUserRewardHistory(userId: number, limit: number = 50) {
    return await db
      .select()
      .from(rewardActivities)
      .where(eq(rewardActivities.userId, userId))
      .orderBy(desc(rewardActivities.createdAt))
      .limit(limit);
  }

  // Get user's current points balance
  static async getUserPoints(userId: number): Promise<number> {
    const [user] = await db
      .select({ rewardPoints: users.rewardPoints })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.rewardPoints || 0;
  }

  // Redeem points for a reward
  static async redeemReward(
    userId: number, 
    rewardType: keyof typeof REWARD_CATALOG
  ): Promise<boolean> {
    const reward = REWARD_CATALOG[rewardType];
    if (!reward) {
      throw new Error('Invalid reward type');
    }

    const userPoints = await this.getUserPoints(userId);
    if (userPoints < reward.points) {
      throw new Error('Insufficient points');
    }

    try {
      await db.transaction(async (tx) => {
        // Deduct points from user
        await tx
          .update(users)
          .set({ rewardPoints: userPoints - reward.points })
          .where(eq(users.id, userId));

        // Create redemption record
        const expiresAt = reward.duration !== 'one-time' 
          ? new Date(Date.now() + this.getDurationMs(reward.duration))
          : null;

        await tx.insert(rewardRedemptions).values({
          userId,
          rewardType,
          pointsCost: reward.points,
          description: reward.description,
          expiresAt,
        });
      });

      return true;
    } catch (error) {
      console.error('Error redeeming reward:', error);
      throw error;
    }
  }

  // Get user's active redemptions
  static async getUserRedemptions(userId: number) {
    return await db
      .select()
      .from(rewardRedemptions)
      .where(eq(rewardRedemptions.userId, userId))
      .orderBy(desc(rewardRedemptions.redeemedAt));
  }

  // Check if user has completed profile for points
  static async checkProfileCompletion(userId: number): Promise<boolean> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    if (!user) return false;

    // Check if profile is complete (has all basic info)
    const isComplete = !!(
      user.firstName &&
      user.lastName &&
      user.email &&
      user.location &&
      user.experience !== null &&
      user.skills &&
      user.skills.length > 0
    );

    // Award points if profile just became complete and hasn't been awarded before
    if (isComplete && !user.profileCompleted) {
      await db
        .update(users)
        .set({ profileCompleted: true })
        .where(eq(users.id, userId));

      await this.awardPoints(userId, 'PROFILE_COMPLETE');
    }

    return isComplete;
  }

  // Helper methods
  private static getActivityDescription(activityType: string, points: number): string {
    const descriptions: Record<string, string> = {
      BLOG_READ: `Read a blog post (+${points} points)`,
      BLOG_WRITE: `Published a blog post (+${points} points)`,
      PROFILE_COMPLETE: `Completed profile (+${points} points)`,
      FRIEND_REFER: `Referred a friend (+${points} points)`,
      JOB_APPLICATION: `Applied to a job (+${points} points)`,
      RESUME_UPLOAD: `Uploaded resume (+${points} points)`,
      SKILL_ADD: `Added a skill (+${points} points)`,
      COMPANY_FOLLOW: `Followed a company (+${points} points)`,
      JOB_SAVE: `Saved a job (+${points} points)`,
      DAILY_LOGIN: `Daily login bonus (+${points} points)`,
      PROFILE_UPDATE: `Updated profile (+${points} points)`,
    };
    
    return descriptions[activityType] || `Activity completed (+${points} points)`;
  }

  private static getDurationMs(duration: string): number {
    const durations: Record<string, number> = {
      '7 days': 7 * 24 * 60 * 60 * 1000,
      '14 days': 14 * 24 * 60 * 60 * 1000,
      '30 days': 30 * 24 * 60 * 60 * 1000,
    };
    
    return durations[duration] || 0;
  }

  // Get leaderboard (top users by points)
  static async getLeaderboard(limit: number = 10) {
    return await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        rewardPoints: users.rewardPoints,
      })
      .from(users)
      .orderBy(desc(users.rewardPoints))
      .limit(limit);
  }
}