import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Image, X } from "lucide-react";

interface UniversityLogoUploadProps {
 universityId: string;
 currentLogo?: string;
 onLogoChange?: (logoUrl: string) => void;
}

export default function UniversityLogoUpload({
 universityId,
 currentLogo,
 onLogoChange
}: UniversityLogoUploadProps) {
 const { toast } = useToast();
 const [uploading, setUploading] = useState(false);
 const [preview, setPreview] = useState<string>(currentLogo || "");
 const fileInputRef = useRef<HTMLInputElement>(null);

 const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith('image/')) {
   toast({
    variant: "destructive",
    title: "خطأ في الملف",
    description: "يرجى اختيار ملف صورة صالح",
   });
   return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
   toast({
    variant: "destructive",
    title: "حجم الملف كبير جداً",
    description: "الحد الأقصى لحجم الصورة هو 5 ميجابايت",
   });
   return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
   const result = e.target?.result as string;
   setPreview(result);
   uploadLogo(file, result);
  };
  reader.readAsDataURL(file);
 };

 const uploadLogo = async (file: File, dataUrl: string) => {
  setUploading(true);

  try {
   // In a real app, you would upload to a service like Supabase Storage
   // For now, we'll just use the data URL
   const logoUrl = dataUrl;

   // Simulate upload delay
   await new Promise(resolve => setTimeout(resolve, 1000));

   onLogoChange?.(logoUrl);

   toast({
    title: "تم رفع الشعار بنجاح",
    description: "تم تحديث شعار الجامعة",
   });
  } catch (error: any) {
   toast({
    variant: "destructive",
    title: "خطأ في رفع الشعار",
    description: error.message || "يرجى المحاولة مرة أخرى",
   });
  } finally {
   setUploading(false);
  }
 };

 const handleRemoveLogo = () => {
  setPreview("");
  onLogoChange?.("");
  if (fileInputRef.current) {
   fileInputRef.current.value = "";
  }
 };

 return (
  <Card>
   <CardHeader>
    <CardTitle className="flex items-center gap-2">
     <Image className="w-5 h-5" />
     شعار الجامعة
    </CardTitle>
    <CardDescription>
     قم برفع شعار الجامعة ليظهر في الباركود والواجهات
    </CardDescription>
   </CardHeader>
   <CardContent>
    <div className="space-y-4">
     {/* Preview */}
     <div className="flex justify-center">
      {preview ? (
       <div className="relative">
        <img
         src={preview}
         alt="شعار الجامعة"
         className="w-32 h-32 object-cover rounded-lg border"
        />
        <Button
         variant="destructive"
         size="sm"
         className="absolute -top-2 -right-2 h-8 w-8 p-0"
         onClick={handleRemoveLogo}
        >
         <X className="w-4 h-4" />
        </Button>
       </div>
      ) : (
       <div className="w-32 h-32 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50">
        <Image className="w-8 h-8 text-muted-foreground" />
       </div>
      )}
     </div>

     {/* Upload Button */}
     <div className="flex flex-col gap-2">
      <Button
       variant="outline"
       className="w-full"
       onClick={() => fileInputRef.current?.click()}
       disabled={uploading}
      >
       {uploading ? (
        <>
         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
         جاري الرفع...
        </>
       ) : (
        <>
         <Upload className="w-4 h-4 mr-2" />
         اختيار شعار
        </>
       )}
      </Button>

      <input
       ref={fileInputRef}
       type="file"
       accept="image/*"
       className="hidden"
       onChange={handleFileSelect}
      />

      <p className="text-xs text-muted-foreground text-center">
       الصيغ المسموح: JPG, PNG, GIF | الحد الأقصى: 5MB
      </p>
     </div>
    </div>
   </CardContent>
  </Card>
 );
}