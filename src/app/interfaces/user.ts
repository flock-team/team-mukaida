export interface User {
  uid: string;
  name: string;
  avatarURL: string;
  createdAt: Date;
  likedUid?: string;
}
