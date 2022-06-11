export interface ObjectUser {
  username: string;
  password: string;
  confirmPassword?: string | null;
  userType: number;
  isDeleted: boolean;
}
