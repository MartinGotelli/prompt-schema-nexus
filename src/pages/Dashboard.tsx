import React from "react";
import StatsCard from "@/components/ui/StatsCard";
import { Activity, Palette, Zap } from "lucide-react";
import DashboardActions from "@/components/dashboard/DashboardActions";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <DashboardActions />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Total Prompts"
          value="32"
          description="Across 5 AI agents"
          icon={<Palette className="h-4 w-4 text-primary" />}
        />
        <StatsCard 
          title="Total Schemas"
          value="14"
          description="For data validation"
          icon={<Activity className="h-4 w-4 text-primary" />}
        />
        <StatsCard 
          title="API Calls"
          value="1,204"
          description="Last 30 days"
          icon={<Zap className="h-4 w-4 text-primary" />}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Additional dashboard content can be placed here */}
      </div>
    </div>
  );
};

export default Dashboard;
