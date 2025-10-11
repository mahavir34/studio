import type { InvestmentProduct, AchievementTask, ReferralLevel } from './types';

export const investmentProducts: InvestmentProduct[] = [
  {
    id: 'prod1',
    name: 'AI Quantify 1',
    description: 'Limited edition AI-powered investment product.',
    price: 500,
    dailyReturn: 25,
    cycle: 30,
    totalReturn: 750,
    limit: 1,
    imageId: 'prod1-img'
  },
  {
    id: 'prod2',
    name: 'AI Grid Trading',
    description: 'Stable returns through automated grid trading.',
    price: 1000,
    dailyReturn: 55,
    cycle: 45,
    totalReturn: 2475,
    limit: null,
    imageId: 'prod2-img'
  },
  {
    id: 'prod3',
    name: 'Future Tech Fund',
    description: 'Invest in emerging technology portfolios.',
    price: 3000,
    dailyReturn: 180,
    cycle: 60,
    totalReturn: 10800,
    limit: null,
    imageId: 'prod3-img'
  },
];

export const achievementTasks: AchievementTask[] = [
  {
    id: 'task1',
    title: 'First Recharge',
    description: 'Make your first deposit to get a bonus.',
    reward: 100,
    progress: 0,
    target: 1,
    isCompleted: false,
  },
  {
    id: 'task2',
    title: 'Invite 5 Friends',
    description: 'Invite 5 new users who successfully register.',
    reward: 500,
    progress: 2,
    target: 5,
    isCompleted: false,
  },
  {
    id: 'task3',
    title: 'Total Investment',
    description: 'Reach a total investment amount of 10000.',
    reward: 1000,
    progress: 3500,
    target: 10000,
    isCompleted: false,
  },
  {
    id: 'task4',
    title: 'Daily Check-in Streak',
    description: 'Check in for 7 consecutive days.',
    reward: 200,
    progress: 3,
    target: 7,
    isCompleted: false,
  }
];

export const referralLevels: ReferralLevel[] = [
  { level: 1, commission: 10 },
  { level: 2, commission: 5 },
  { level: 3, commission: 2 },
];
