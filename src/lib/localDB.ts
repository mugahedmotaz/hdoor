// Local in-browser database fallback to mimic required Supabase features
// Data is persisted in localStorage under the key ATTENDANCE_APP_DB

export type AppRole = "student" | "professor" | "admin";

export interface LocalUser {
  id: string;
  email: string;
  password: string;
  full_name: string;
  university_id: string;
  role: AppRole;
  created_at: string;
}

export interface DeviceBinding {
  id: string;
  user_id: string;
  device_fingerprint: string;
  device_name?: string | null;
  is_active?: boolean | null;
  created_at: string;
  last_used_at?: string | null;
}

export interface Lecture {
  id: string;
  professor_id: string;
  title: string;
  course_code: string;
  location?: string | null;
  start_time: string; // ISO
  end_time: string;   // ISO
  qr_code_data: string;
  is_active?: boolean | null;
  created_at: string;
}

export interface AttendanceRecord {
  id: string;
  lecture_id: string;
  student_id: string;
  device_fingerprint: string;
  scanned_at: string; // ISO
}

export interface LocalDBShape {
  users: LocalUser[];
  device_bindings: DeviceBinding[];
  lectures: Lecture[];
  attendance: AttendanceRecord[];
  profiles: Array<{ id: string; full_name: string; university_id: string; created_at: string }>;
}

const STORAGE_KEY = "ATTENDANCE_APP_DB";
const SESSION_KEY = "ATTENDANCE_APP_SESSION";

function genId(prefix = "id"): string {
  // Simple unique id generator
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function loadDB(): LocalDBShape {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      return JSON.parse(raw) as LocalDBShape;
    } catch {}
  }
  const seed = seedDB();
  saveDB(seed);
  return seed;
}

function saveDB(db: LocalDBShape) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function seedDB(): LocalDBShape {
  const now = new Date().toISOString();

  // Demo professor and student
  const professorId = genId("user");
  const studentId = genId("user");

  const users: LocalUser[] = [
    {
      id: professorId,
      email: "prof@demo.edu",
      password: "prof123",
      full_name: "أ. خالد العتيبي",
      university_id: "P-10001",
      role: "professor",
      created_at: now,
    },
    {
      id: studentId,
      email: "student@demo.edu",
      password: "student123",
      full_name: "محمد أحمد",
      university_id: "S-20231234",
      role: "student",
      created_at: now,
    },
  ];

  const lectures: Lecture[] = [
    {
      id: genId("lec"),
      professor_id: professorId,
      title: "مقدمة في البرمجة",
      course_code: "CS101",
      location: "قاعة 201",
      start_time: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      end_time: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      qr_code_data: "DEMO-QR-CS101",
      is_active: true,
      created_at: now,
    },
  ];

  const profiles = users.map((u) => ({
    id: u.id,
    full_name: u.full_name,
    university_id: u.university_id,
    created_at: u.created_at,
  }));

  const db: LocalDBShape = {
    users,
    device_bindings: [],
    lectures,
    attendance: [],
    profiles,
  };

  return db;
}

export const LocalDB = {
  // session management
  getSession(): { user: { id: string; email: string } } | null {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },
  setSession(user: { id: string; email: string } | null) {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
    else localStorage.removeItem(SESSION_KEY);
  },

  // auth
  signIn(email: string, password: string) {
    const db = loadDB();
    const user = db.users.find((u) => u.email === email && u.password === password);
    if (!user) throw new Error("بيانات الدخول غير صحيحة");
    this.setSession({ id: user.id, email: user.email });
    return { user };
  },
  signUp(opts: { email: string; password: string; full_name: string; university_id: string; role: AppRole }) {
    const db = loadDB();
    if (db.users.some((u) => u.email === opts.email)) {
      throw new Error("البريد مستخدم مسبقاً");
    }
    const user: LocalUser = {
      id: genId("user"),
      email: opts.email,
      password: opts.password,
      full_name: opts.full_name,
      university_id: opts.university_id,
      role: opts.role,
      created_at: new Date().toISOString(),
    };
    db.users.push(user);
    if (!db.profiles.find((p) => p.id === user.id)) {
      db.profiles.push({ id: user.id, full_name: user.full_name, university_id: user.university_id, created_at: user.created_at });
    }
    saveDB(db);
    return { user };
  },
  signOut() {
    this.setSession(null);
  },

  getUserRole(userId: string): AppRole | null {
    const db = loadDB();
    return db.users.find((u) => u.id === userId)?.role ?? null;
  },

  // device bindings
  getDeviceBinding(user_id: string, fingerprint: string) {
    const db = loadDB();
    return db.device_bindings.find((d) => d.user_id === user_id && d.device_fingerprint === fingerprint) || null;
  },
  upsertDeviceBinding(binding: Omit<DeviceBinding, "id" | "created_at"> & Partial<Pick<DeviceBinding, "id">>) {
    const db = loadDB();
    let rec = db.device_bindings.find((d) => d.id === binding.id);
    if (!rec) {
      rec = {
        id: genId("dev"),
        created_at: new Date().toISOString(),
        is_active: true,
        device_name: binding.device_name ?? null,
        device_fingerprint: binding.device_fingerprint,
        last_used_at: binding.last_used_at ?? null,
        user_id: binding.user_id,
      };
      db.device_bindings.push(rec);
    } else {
      rec.device_name = binding.device_name ?? rec.device_name;
      rec.last_used_at = binding.last_used_at ?? rec.last_used_at;
      rec.is_active = true; // تأكيد التفعيل عند التحديث
    }
    // اجعل باقي الأجهزة لنفس المستخدم غير مفعلة لضمان الحصرية
    db.device_bindings = db.device_bindings.map((d) =>
      d.user_id === binding.user_id && d.device_fingerprint !== binding.device_fingerprint
        ? { ...d, is_active: false }
        : d
    );
    saveDB(db);
    return rec;
  },

  ensureExclusiveActiveDevice(user_id: string, fingerprint: string) {
    const db = loadDB();
    let updated = false;
    db.device_bindings = db.device_bindings.map((d) => {
      if (d.user_id !== user_id) return d;
      if (d.device_fingerprint === fingerprint) {
        updated = true;
        return { ...d, is_active: true, last_used_at: new Date().toISOString() };
      }
      return { ...d, is_active: false };
    });
    if (!updated) {
      db.device_bindings.push({
        id: genId("dev"),
        user_id,
        device_fingerprint: fingerprint,
        device_name: null,
        is_active: true,
        created_at: new Date().toISOString(),
        last_used_at: new Date().toISOString(),
      });
    }
    saveDB(db);
  },

  // internal helper (optional use by dataClient)
  _getAllBindings(user_id: string) {
    const db = loadDB();
    return db.device_bindings.filter((d) => d.user_id === user_id);
  },

  // lectures
  insertLecture(input: Omit<Lecture, "id" | "created_at" | "is_active"> & Partial<Pick<Lecture, "is_active">>) {
    const db = loadDB();
    const rec: Lecture = {
      id: genId("lec"),
      created_at: new Date().toISOString(),
      is_active: input.is_active ?? true,
      ...input,
    };
    db.lectures.unshift(rec);
    saveDB(db);
    return rec;
  },
  getLecturesByProfessor(user_id: string) {
    const db = loadDB();
    return db.lectures.filter((l) => l.professor_id === user_id).sort((a, b) => b.start_time.localeCompare(a.start_time));
  },
  findLectureByQr(qr: string) {
    const db = loadDB();
    return db.lectures.find((l) => l.qr_code_data === qr && (l.is_active ?? true)) || null;
  },

  // attendance
  insertAttendance(input: Omit<AttendanceRecord, "id" | "scanned_at"> & Partial<Pick<AttendanceRecord, "scanned_at">>) {
    const db = loadDB();
    // prevent duplicate
    const exists = db.attendance.find((a) => a.lecture_id === input.lecture_id && a.student_id === input.student_id);
    if (exists) return exists;
    const rec: AttendanceRecord = {
      id: genId("att"),
      scanned_at: input.scanned_at ?? new Date().toISOString(),
      device_fingerprint: input.device_fingerprint,
      lecture_id: input.lecture_id,
      student_id: input.student_id,
    };
    db.attendance.unshift(rec);
    saveDB(db);
    return rec;
  },
  getAttendanceByStudent(student_id: string) {
    const db = loadDB();
    return db.attendance
      .filter((a) => a.student_id === student_id)
      .map((a) => ({
        ...a,
        lectures: db.lectures.find((l) => l.id === a.lecture_id) || undefined,
      }))
      .sort((a, b) => b.scanned_at.localeCompare(a.scanned_at));
  },
  getAttendanceByLectureIds(lectureIds: string[]) {
    const db = loadDB();
    return db.attendance
      .filter((a) => lectureIds.includes(a.lecture_id))
      .map((a) => ({
        ...a,
        lectures: db.lectures.find((l) => l.id === a.lecture_id) || undefined,
        profiles: db.profiles.find((p) => p.id === a.student_id) || undefined,
      }))
      .sort((a, b) => b.scanned_at.localeCompare(a.scanned_at));
  },
};
