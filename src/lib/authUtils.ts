import { dataClient } from "./dataClient";

export interface AuthUser {
 id: string;
 email: string;
 role: 'admin' | 'professor' | 'student';
 full_name?: string;
 university_id?: string;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
 try {
  const { data: { session } } = await dataClient.getSession();

  if (!session?.user) {
   return null;
  }

  const role = await dataClient.getUserRoleAsync(session.user.id);

  return {
   id: session.user.id,
   email: session.user.email || '',
   role: role || 'student',
   full_name: session.user.user_metadata?.full_name,
   university_id: session.user.user_metadata?.university_id
  };
 } catch (error) {
  console.error("Error getting current user:", error);
  return null;
 }
}

export async function requireAuth(requiredRole?: 'admin' | 'professor' | 'student'): Promise<AuthUser> {
 const user = await getCurrentUser();

 if (!user) {
  throw new Error('يجب تسجيل الدخول أولاً');
 }

 if (requiredRole && user.role !== requiredRole) {
  const roleNames = {
   admin: 'مدير جامعة',
   professor: 'أستاذ',
   student: 'طالب'
  };
  throw new Error(`هذه الصفحة مخصصة لـ${roleNames[requiredRole]} فقط`);
 }

 return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
 try {
  const role = await dataClient.getUserRoleAsync(userId);
  return role === 'admin';
 } catch (error) {
  console.error("Error checking admin role:", error);
  return false;
 }
}

export async function isProfessor(userId: string): Promise<boolean> {
 try {
  const role = await dataClient.getUserRoleAsync(userId);
  return role === 'professor';
 } catch (error) {
  console.error("Error checking professor role:", error);
  return false;
 }
}

export async function isStudent(userId: string): Promise<boolean> {
 try {
  const role = await dataClient.getUserRoleAsync(userId);
  return role === 'student';
 } catch (error) {
  console.error("Error checking student role:", error);
  return false;
 }
}