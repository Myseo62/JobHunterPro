import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useRewardTracking(userId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const trackActivity = useMutation({
    mutationFn: async ({ activityType, customPoints }: { activityType: string; customPoints?: number }) => {
      return apiRequest("POST", "/api/rewards/activity", {
        userId,
        activityType,
        customPoints
      });
    },
    onSuccess: () => {
      // Invalidate rewards cache to refresh points
      queryClient.invalidateQueries({ queryKey: [`/api/rewards/user/${userId}`] });
    },
    onError: (error) => {
      console.error("Failed to track reward activity:", error);
    },
  });

  const showPointsEarned = (activityType: string, points: number) => {
    const activityNames: Record<string, string> = {
      BLOG_READ: "Reading blog",
      BLOG_WRITE: "Writing blog",
      PROFILE_COMPLETE: "Completing profile",
      FRIEND_REFER: "Referring friend",
      JOB_APPLICATION: "Job application",
      RESUME_UPLOAD: "Uploading resume",
      SKILL_ADD: "Adding skill",
      COMPANY_FOLLOW: "Following company",
      JOB_SAVE: "Saving job",
      DAILY_LOGIN: "Daily login",
      PROFILE_UPDATE: "Updating profile",
    };

    toast({
      title: "Points Earned! 🌟",
      description: `${activityNames[activityType] || "Activity"} earned you ${points} points!`,
      duration: 3000,
    });
  };

  const trackAndNotify = (activityType: string, customPoints?: number) => {
    trackActivity.mutate({ activityType, customPoints });
    const points = customPoints || getPointsForActivity(activityType);
    showPointsEarned(activityType, points);
  };

  return { trackAndNotify, trackActivity };
}

function getPointsForActivity(activityType: string): number {
  const points: Record<string, number> = {
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
  };
  return points[activityType] || 0;
}