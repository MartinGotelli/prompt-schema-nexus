
import React from "react";
import CreateButtons from "./CreateButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DashboardActions: React.FC = () => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4">
        <CreateButtons />
      </CardContent>
    </Card>
  );
};

export default DashboardActions;
