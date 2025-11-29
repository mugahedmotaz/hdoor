import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateLecture from "@/components/CreateLecture";
import LecturesList from "@/components/LecturesList";
import { Plus, List } from "lucide-react";

interface ProfessorDashboardProps {
  userId: string;
}

const ProfessorDashboard = ({ userId }: ProfessorDashboardProps) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLectureCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-elegant">
        <CardHeader>
          <CardTitle className="text-2xl">لوحة تحكم الأستاذ</CardTitle>
          <CardDescription>إدارة المحاضرات ومتابعة الحضور</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="create" className="gap-2">
                <Plus className="w-4 h-4" />
                محاضرة جديدة
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="w-4 h-4" />
                المحاضرات
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateLecture userId={userId} onLectureCreated={handleLectureCreated} />
            </TabsContent>

            <TabsContent value="list">
              <LecturesList userId={userId} refreshKey={refreshKey} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfessorDashboard;
