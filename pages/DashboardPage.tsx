import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useTheme } from "../hooks/ThemeContext";
import { Goal } from "../hooks/types";
import UserInfoCard from "../components/dashboard/UserInfoCard";
import RecentlyCreatedGoals from "../components/dashboard/RecentlyCreatedGoals";
import GoalService from "../services/GoalService";

interface props {
  refresh: number;
}

const DashboardPage = ({ refresh }: props) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [completedGoals, setCompletedGoals] = useState<number>(0);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchData() {
      try {
        const [goalsData, completedGoalsCount] = await Promise.all([
          GoalService.getAllGoals(),
          GoalService.getCompletedGoalsCount(),
        ]);

        setGoals(Array.isArray(goalsData) ? goalsData : []);
        setCompletedGoals(
          typeof completedGoalsCount === "number" ? completedGoalsCount : 0,
        );
      } catch (e) {
        // If either call throws, fail safe
        setGoals([]);
        setCompletedGoals(0);
        console.warn("Dashboard fetch failed:", e);
      }
    }
    fetchData();
  }, [refresh]);

  return (
    <ScrollView style={{ backgroundColor: theme.background, padding: 16 }}>
      <UserInfoCard
        totalGoals={Array.isArray(goals) ? goals.length : 0}
        completedGoals={completedGoals ?? 0}
        streaks={3}
      />
      {/* <GoalsPieChart completed={completedGoals} total={goals.length} /> */}
      <RecentlyCreatedGoals goals={goals} />
    </ScrollView>
  );
};

export default DashboardPage;
