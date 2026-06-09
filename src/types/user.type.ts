export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserPayload {
  sub: string;
  email: string;
}