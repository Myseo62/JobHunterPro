import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Star, 
  Trophy, 
  Gift, 
  History, 
  Crown,
  Sparkles,
  Clock,
  CheckCircle,
  TrendingUp,
  Target
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface RewardPointsWidgetProps {
  user: any;
  compact?: boolean;
}

export default function RewardPointsWidget({ user, compact = false }: RewardPointsWidgetProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showRewardsModal, setShowRewardsModal] = useState(false);

  const { data: rewardData, isLoading } = useQuery({
    queryKey: [`/api/rewards/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/rewards/leaderboard"],
  });

  const redeemMutation = useMutation({
    mutationFn: async ({ rewardType }: { rewardType: string }) => {
      return apiRequest("POST", "/api/rewards/redeem", {
        userId: user.id,
        rewardType
      });
    },
    onSuccess: () => {
      toast({
        title: "Reward Redeemed!",
        description: "Your reward has been successfully redeemed.",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/rewards/user/${user?.id}`] });
    },
    onError: (error: any) => {
      toast({
        title: "Redemption Failed",
        description: error.message || "Failed to redeem reward",
        variant: "destructive",
      });
    },
  });

  if (isLoading || !rewardData) {
    return (
      <div className="animate-pulse">
        <div className="h-16 bg-gray-200 rounded-lg"></div>
      </div>
    );
  }

  const { points = 0, history = [], redemptions = [], catalog = {} } = rewardData as any;

  if (compact) {
    return (
      <Dialog open={showRewardsModal} onOpenChange={setShowRewardsModal}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-colors"
          >
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{points}</span>
            <span className="text-sm text-gray-600">Points</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Reward Points Dashboard
            </DialogTitle>
          </DialogHeader>
          <RewardsDashboard 
            points={points}
            history={history}
            redemptions={redemptions}
            catalog={catalog}
            leaderboard={leaderboard || []}
            onRedeem={(rewardType) => redeemMutation.mutate({ rewardType })}
            isRedeeming={redeemMutation.isPending}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="cb-glassmorphism border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Star className="h-5 w-5 text-yellow-500" />
          Reward Points
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-3xl font-bold text-purple-600">{points}</div>
            <div className="text-sm text-gray-600">Available Points</div>
          </div>
          <Button 
            onClick={() => setShowRewardsModal(true)}
            className="cb-gradient-primary"
          >
            <Gift className="h-4 w-4 mr-2" />
            Redeem
          </Button>
        </div>
        
        {history && history.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-700">Recent Activity</h4>
            {history.slice(0, 3).map((activity: any) => (
              <div key={activity.id} className="flex items-center justify-between text-sm">
                <span className="text-gray-600 truncate">{activity.description}</span>
                <span className="text-green-600 font-medium">+{activity.points}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RewardsDashboard({ 
  points, 
  history, 
  redemptions, 
  catalog, 
  leaderboard, 
  onRedeem, 
  isRedeeming 
}: {
  points: number;
  history: any[];
  redemptions: any[];
  catalog: any;
  leaderboard: any[];
  onRedeem: (rewardType: string) => void;
  isRedeeming: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8" />
              <div>
                <div className="text-2xl font-bold">{points}</div>
                <div className="text-sm opacity-90">Available Points</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <div className="text-2xl font-bold">{history.length}</div>
                <div className="text-sm text-gray-600">Total Activities</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Gift className="h-8 w-8 text-orange-600" />
              <div>
                <div className="text-2xl font-bold">{redemptions.length}</div>
                <div className="text-sm text-gray-600">Rewards Redeemed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="catalog" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="catalog">Reward Catalog</TabsTrigger>
          <TabsTrigger value="history">Activity History</TabsTrigger>
          <TabsTrigger value="redemptions">My Rewards</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="catalog" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(catalog).map(([key, reward]: [string, any]) => (
              <Card key={key} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{reward.description}</h3>
                      <p className="text-sm text-gray-600 mt-1">Duration: {reward.duration}</p>
                    </div>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {reward.points} pts
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => onRedeem(key)}
                    disabled={points < reward.points || isRedeeming}
                    className="w-full cb-gradient-primary"
                    size="sm"
                  >
                    {points < reward.points ? 'Insufficient Points' : 'Redeem'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="space-y-3">
            {history.map((activity: any) => (
              <Card key={activity.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">{activity.description}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      +{activity.points}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="redemptions" className="space-y-4">
          <div className="space-y-3">
            {redemptions.map((redemption: any) => (
              <Card key={redemption.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Gift className="h-5 w-5 text-purple-600" />
                      <div>
                        <p className="font-medium">{redemption.description}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>Redeemed {new Date(redemption.redeemedAt).toLocaleDateString()}</span>
                          {redemption.expiresAt && (
                            <span>• Expires {new Date(redemption.expiresAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-red-600 border-red-300">
                        -{redemption.pointsCost}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">{redemption.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="space-y-3">
            {leaderboard?.map((user: any, index: number) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {index === 0 && <Crown className="h-6 w-6 text-yellow-500" />}
                      {index === 1 && <Trophy className="h-6 w-6 text-gray-400" />}
                      {index === 2 && <Trophy className="h-6 w-6 text-orange-600" />}
                      {index > 2 && <Target className="h-6 w-6 text-gray-400" />}
                      <div>
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-600">Rank #{index + 1}</p>
                      </div>
                    </div>
                    <Badge variant="default" className="bg-purple-100 text-purple-800">
                      {user.rewardPoints} pts
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}