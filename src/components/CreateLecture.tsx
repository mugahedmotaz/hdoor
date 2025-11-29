import { useState } from "react";
import { dataClient } from "@/lib/dataClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreateLectureProps {
  userId: string;
  onLectureCreated: () => void;
}

const CreateLecture = ({ userId, onLectureCreated }: CreateLectureProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    courseCode: "",
    location: "",
    startTime: "",
    endTime: "",
  });

  const generateQRCode = () => {
    return `LECTURE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dataClient.insertLecture({
        professor_id: userId,
        title: formData.title,
        course_code: formData.courseCode,
        location: formData.location,
        qr_code_data: generateQRCode(),
        start_time: new Date(formData.startTime).toISOString(),
        end_time: new Date(formData.endTime).toISOString(),
      });

      toast({
        title: "تم إنشاء المحاضرة",
        description: "تم إنشاء المحاضرة وتوليد الباركود بنجاح",
      });

      setFormData({
        title: "",
        courseCode: "",
        location: "",
        startTime: "",
        endTime: "",
      });

      onLectureCreated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">اسم المحاضرة</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          placeholder="مقدمة في البرمجة"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="courseCode">كود المادة</Label>
        <Input
          id="courseCode"
          value={formData.courseCode}
          onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
          required
          placeholder="CS101"
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">القاعة</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          placeholder="قاعة 201"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">وقت البداية</Label>
          <Input
            id="startTime"
            type="datetime-local"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="endTime">وقت النهاية</Label>
          <Input
            id="endTime"
            type="datetime-local"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "جاري الإنشاء..." : "إنشاء محاضرة"}
      </Button>
    </form>
  );
};

export default CreateLecture;
