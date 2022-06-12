export interface ObjectUser {
  userId?: number | null;
  username: string;
  password?: string | null;
  confirmPassword?: string | null;
  userType: number;
}
