import { supabase } from "@/integrations/supabase/client";
import { LocalDB, AppRole } from "./localDB";

const USE_LOCAL = (import.meta as any).env?.VITE_USE_LOCAL_DATA === "true"
  || !((import.meta as any).env?.VITE_SUPABASE_URL && (import.meta as any).env?.VITE_SUPABASE_PUBLISHABLE_KEY);

export const dataClient = {
  // Auth
  async getSession() {
    if (USE_LOCAL) {
      const session = LocalDB.getSession();
      return { data: { session }, error: null } as any;
    }
    return await supabase.auth.getSession();
  },

  async signIn(email: string, password: string) {
    if (USE_LOCAL) {
      const { user } = LocalDB.signIn(email, password);
      return { data: { user }, error: null } as any;
    }
    return await supabase.auth.signInWithPassword({ email, password });
  },

  async signUp(email: string, password: string, full_name: string, university_id: string, role: AppRole) {
    if (USE_LOCAL) {
      try {
        const { user } = LocalDB.signUp({ email, password, full_name, university_id, role });
        return { data: { user }, error: null } as any;
      } catch (error: any) {
        console.error("LocalDB signUp error:", error);
        return { data: { user: null }, error: { message: error.message } } as any;
      }
    }
    try {
      const res = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name, university_id }, emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (res.data.user) {
        await supabase.from("user_roles").insert({ user_id: res.data.user.id, role });
      }
      return res;
    } catch (error: any) {
      console.error("Supabase signUp error:", error);
      return { data: { user: null }, error: { message: error.message } } as any;
    }
  },

  async signOut() {
    if (USE_LOCAL) {
      LocalDB.signOut();
      return { error: null } as any;
    }
    return await supabase.auth.signOut();
  },

  getUserRole(userId: string): AppRole | null {
    if (USE_LOCAL) {
      return LocalDB.getUserRole(userId);
    }
    // For Supabase path, consumers should query explicitly; kept for API symmetry, returns null here.
    return null;
  },

  async getUserRoleAsync(userId: string): Promise<AppRole | null> {
    if (USE_LOCAL) {
      return LocalDB.getUserRole(userId);
    }
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return null;
    return (data?.role as AppRole) ?? null;
  },

  // Device bindings
  async getDeviceBinding(user_id: string, fingerprint: string) {
    if (USE_LOCAL) {
      return LocalDB.getDeviceBinding(user_id, fingerprint);
    }
    const { data } = await supabase
      .from("device_bindings")
      .select("*")
      .eq("user_id", user_id)
      .eq("device_fingerprint", fingerprint)
      .maybeSingle();
    return data;
  },

  async getActiveDeviceBinding(user_id: string) {
    if (USE_LOCAL) {
      // استرجاع أي جهاز فعّال للمستخدم من LocalDB
      const all = (LocalDB as any)._getAllBindings
        ? (LocalDB as any)._getAllBindings(user_id)
        : null;
      if (all) return all.find((b: any) => b.is_active) ?? null;
      // fallback: لا توجد API مخصّصة؛ ليس ضرورياً حالياً
      return null;
    }
    const { data } = await supabase
      .from("device_bindings")
      .select("*")
      .eq("user_id", user_id)
      .eq("is_active", true)
      .maybeSingle();
    return data;
  },

  async ensureExclusiveDevice(user_id: string, fingerprint: string, device_name?: string | null) {
    if (USE_LOCAL) {
      LocalDB.ensureExclusiveActiveDevice(user_id, fingerprint);
      return { ok: true } as const;
    }
    // Supabase: عطّل جميع أجهزة المستخدم الأخرى ثم فعّل هذا الجهاز
    const { error: disableErr } = await supabase
      .from("device_bindings")
      .update({ is_active: false })
      .eq("user_id", user_id)
      .neq("device_fingerprint", fingerprint);
    if (disableErr) throw disableErr;

    const { error: upsertErr } = await supabase
      .from("device_bindings")
      .upsert({
        user_id,
        device_fingerprint: fingerprint,
        device_name: device_name ?? null,
        is_active: true,
        last_used_at: new Date().toISOString(),
      }, { onConflict: "user_id,device_fingerprint" });
    if (upsertErr) throw upsertErr;
    return { ok: true } as const;
  },

  async upsertDeviceBinding(payload: { user_id: string; device_fingerprint: string; device_name?: string | null; last_used_at?: string | null }) {
    if (USE_LOCAL) {
      return LocalDB.upsertDeviceBinding(payload);
    }
    const { data, error } = await supabase
      .from("device_bindings")
      .upsert({ ...payload, is_active: true }, { onConflict: "user_id,device_fingerprint" })
      .select("*")
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  // Lectures
  async getLecturesByProfessor(user_id: string) {
    if (USE_LOCAL) {
      return LocalDB.getLecturesByProfessor(user_id);
    }
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("professor_id", user_id)
      .order("start_time", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async insertLecture(input: { professor_id: string; title: string; course_code: string; location?: string | null; start_time: string; end_time: string; qr_code_data: string; is_active?: boolean | null }) {
    if (USE_LOCAL) {
      return LocalDB.insertLecture(input);
    }
    const { data, error } = await supabase
      .from("lectures")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  async findLectureByQr(qr: string) {
    if (USE_LOCAL) {
      return LocalDB.findLectureByQr(qr);
    }
    const { data } = await supabase
      .from("lectures")
      .select("*")
      .eq("qr_code_data", qr)
      .eq("is_active", true)
      .maybeSingle();
    return data;
  },

  // Attendance
  async insertAttendance(input: { lecture_id: string; student_id: string; professor_id: string; device_fingerprint: string; scanned_at?: string }) {
    if (USE_LOCAL) {
      return LocalDB.insertAttendance(input);
    }
    const { data, error } = await supabase
      .from("attendance")
      .insert(input)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  },

  async getAttendanceByStudent(student_id: string) {
    if (USE_LOCAL) {
      return LocalDB.getAttendanceByStudent(student_id);
    }
    const { data, error } = await supabase
      .from("attendance")
      .select("*, lectures ( title, course_code, start_time )")
      .eq("student_id", student_id)
      .order("scanned_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAttendanceByLectureIds(lectureIds: string[]) {
    if (USE_LOCAL) {
      return LocalDB.getAttendanceByLectureIds(lectureIds);
    }
    const { data, error } = await supabase
      .from("attendance")
      .select("*, lectures ( title, course_code, start_time ), profiles!attendance_student_id_fkey ( full_name, university_id )")
      .in("lecture_id", lectureIds)
      .order("scanned_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAttendanceByLecture(lectureId: string) {
    if (USE_LOCAL) {
      return LocalDB.getAttendanceByLecture(lectureId);
    }
    const { data, error } = await supabase
      .from("attendance")
      .select("*, profiles!attendance_student_id_fkey ( full_name, university_id )")
      .eq("lecture_id", lectureId)
      .order("scanned_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllStudents() {
    if (USE_LOCAL) {
      return LocalDB.getAllStudents();
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, university_id")
      .eq("role", "student")
      .order("full_name");
    if (error) throw error;
    return (data || []) as any[];
  },

  async getLectureById(lectureId: string) {
    if (USE_LOCAL) {
      return LocalDB.getLectureById(lectureId);
    }
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .eq("id", lectureId)
      .single();
    if (error) throw error;
    return data;
  },

  // University management
  async createUniversity(university: { id: string; name: string; admin_id: string; is_active: boolean }) {
    if (USE_LOCAL) {
      return LocalDB.createUniversity(university);
    }
    const { data, error } = await (supabase as any)
      .from("universities")
      .insert(university)
      .single();
    if (error) throw error;
    return data;
  },

  async getAllProfessors() {
    if (USE_LOCAL) {
      return LocalDB.getAllProfessors();
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, university_id, email")
      .eq("role", "professor")
      .order("full_name");
    if (error) throw error;
    return data || [];
  },

  async getAllLectures() {
    if (USE_LOCAL) {
      return LocalDB.getAllLectures();
    }
    const { data, error } = await supabase
      .from("lectures")
      .select("*")
      .order("start_time", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async getAllAttendance() {
    if (USE_LOCAL) {
      return LocalDB.getAllAttendance();
    }
    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .order("scanned_at", { ascending: false });
    if (error) throw error;
    return data || [];
  },

  async resetUserPassword(userId: string, newPassword: string) {
    if (USE_LOCAL) {
      return LocalDB.resetUserPassword(userId, newPassword);
    }
    const { data, error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });
    if (error) throw error;
    return data;
  },

  async deleteUser(userId: string) {
    if (USE_LOCAL) {
      return LocalDB.deleteUser(userId);
    }
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (error) throw error;
    return true;
  },

  async getUniversityById(universityId: string) {
    if (USE_LOCAL) {
      return LocalDB.getUniversityById(universityId);
    }
    const { data, error } = await (supabase as any)
      .from("universities")
      .select("*")
      .eq("id", universityId)
      .single();
    if (error) throw error;
    return data;
  },

  async updateUniversity(universityId: string, updates: { name: string }) {
    if (USE_LOCAL) {
      return LocalDB.updateUniversity(universityId, updates);
    }
    const { data, error } = await (supabase as any)
      .from("universities")
      .update(updates)
      .eq("id", universityId)
      .single();
    if (error) throw error;
    return data;
  },
};
