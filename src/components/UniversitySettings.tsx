import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { dataClient } from "@/lib/dataClient";
import { Building2, Save, Upload } from "lucide-react";

interface UniversitySettingsProps {
 universityId: string;
 adminId: string;
}

export default function UniversitySettings({ universityId, adminId }: UniversitySettingsProps) {
 const { toast } = useToast();
 const [loading, setLoading] = useState(false);
 const [university, setUniversity] = useState<any>(null);
 const [formData, setFormData] = useState({
  name: "",
 });

 const fetchUniversity = async () => {
  try {
   const uniData = await dataClient.getUniversityById(universityId);
   setUniversity(uniData);
   setFormData({ name: uniData?.name || "" });
  } catch (error) {
   console.error("Error fetching university:", error);
  }
 };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
   await dataClient.updateUniversity(universityId, {
    name: formData.name,
   });

   toast({
    title: "تم تحديث إعدادات الجامعة",
    description: "تم حفظ التغييرات بنجاح",
   });

   fetchUniversity();
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في تحديث الإعدادات",
    description: error.message || "يرجى المحاولة مرة أخرى",
   });
  } finally {
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchUniversity();
 }, [universityId]);

 return (
  <Card>
   <CardHeader>
    <CardTitle className="flex items-center gap-2">
     <Building2 className="w-5 h-5" />
     إعدادات الجامعة
    </CardTitle>
    <CardDescription>
     تحديث معلومات الجامعة وإعدادات النظام
    </CardDescription>
   </CardHeader>
   <CardContent>
    <form onSubmit={handleSubmit} className="space-y-6">
     <div className="space-y-2">
      <Label htmlFor="universityName">اسم الجامعة</Label>
      <Input
       id="universityName"
       value={formData.name}
       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
       placeholder="جامعة المملكة"
       required
       dir="rtl"
      />
     </div>

     <div className="space-y-4">
      <div className="p-4 border rounded-lg bg-muted/50">
       <h4 className="font-medium mb-2">معلومات الجامعة</h4>
       <div className="space-y-2 text-sm text-muted-foreground">
        <p>معرف الجامعة: {universityId}</p>
        <p>معرف المدير: {adminId}</p>
       </div>
      </div>
     </div>

     <div className="flex gap-2">
      <Button type="submit" disabled={loading}>
       {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
       <Save className="w-4 h-4 mr-2" />
      </Button>
     </div>
    </form>
   </CardContent>
  </Card>
 );
}