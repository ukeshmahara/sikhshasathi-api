import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterDtoType, LoginDtoType, UpdateProfileDtoType, UpdatePasswordDtoType } from "../dtos/user.dto";
import { findUserByEmail, createUser, findUserById, updateUserById, findUserByIdWithPassword } from "../repositories/user.repository";
import { HttpException } from "../exceptions/http-exception";
import { JWT_SECRET, JWT_EXPIRES_IN, BCRYPT_SALT_ROUNDS } from "../configs/constant";
import { IUserPayload } from "../types/user.type";

export const registerUser = async (data: RegisterDtoType) => {
  // 1. Check for duplicate email
  const existing = await findUserByEmail(data.email);
  if (existing) {
    throw new HttpException("Email is already registered", 409);
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);

  // 3. Save user to DB
  const user = await createUser({ ...data, password: hashedPassword });

  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture ?? null,
    createdAt: user.createdAt,
  };
};

export const loginUser = async (data: LoginDtoType) => {
  // 1. Find user by email
  const user = await findUserByEmail(data.email);
  if (!user) {
    throw new HttpException("Invalid email or password", 401);
  }

  // 2. Verify password
  const isMatch = await bcrypt.compare(data.password, user.password);
  if (!isMatch) {
    throw new HttpException("Invalid email or password", 401);
  }

  // 3. Generate JWT
  const payload: IUserPayload = {
    sub: user._id.toString(),
    email: user.email,
  };

  const access_token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

  return {
    access_token,
    token: access_token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture ?? null,
    },
  };
};

const formatUserResponse = (user: {
  _id: unknown;
  fullName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string | null;
}) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  phoneNumber: user.phoneNumber,
  profilePicture: user.profilePicture ?? null,
});

export const getWhoami = async (userId: string) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new HttpException("User not found", 404);
  }
  return formatUserResponse(user);
};

export const updateUserProfile = async (
  userId: string,
  data: UpdateProfileDtoType,
  filename?: string,
  baseUrl?: string
) => {
  const user = await findUserById(userId);
  if (!user) {
    throw new HttpException("User not found", 404);
  }

  const updateData: {
    fullName?: string;
    phoneNumber?: string;
    profilePicture?: string;
  } = {};

  if (data.fullName) updateData.fullName = data.fullName;
  if (data.phoneNumber) updateData.phoneNumber = data.phoneNumber;
  if (filename && baseUrl) {
    updateData.profilePicture = `${baseUrl}/uploads/profiles/${filename}`;
  }

  const updated = await updateUserById(userId, updateData);
  if (!updated) {
    throw new HttpException("User not found", 404);
  }

  return formatUserResponse(updated);
};

export const updateUserPassword = async (
  userId: string,
  data: UpdatePasswordDtoType
) => {
  const user = await findUserByIdWithPassword(userId);
  if (!user) {
    throw new HttpException("User not found", 404);
  }

  const isMatch = await bcrypt.compare(data.currentPassword, user.password);
  if (!isMatch) {
    throw new HttpException("Current password is incorrect", 400);
  }

  const hashedPassword = await bcrypt.hash(
    data.newPassword,
    BCRYPT_SALT_ROUNDS
  );

  const updated = await updateUserById(userId, { password: hashedPassword });
  if (!updated) {
    throw new HttpException("User not found", 404);
  }

  return formatUserResponse(updated);
};