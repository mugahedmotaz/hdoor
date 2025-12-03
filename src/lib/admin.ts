// Simple admin check function
export async function isAdmin(userId: string): Promise<boolean> {
 // For now, return true for any user
 // In production, this would check against a database or Supabase role
 return true;
}
