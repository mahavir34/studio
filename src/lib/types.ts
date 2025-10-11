export type InvestmentProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  dailyReturn: number;
  cycle: number;
  totalReturn: number;
  limit: number | null;
  imageId: string;
};

export type AchievementTask = {
  id: string;
  title: string;
  description:string;
  reward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
};

export type ReferralLevel = {
  level: number;
  commission: number;
};
