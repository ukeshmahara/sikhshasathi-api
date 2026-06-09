import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterDtoType, LoginDtoType } from "../dtos/user.dto";
import { findUserByEmail, createUser } from "../repositories/user.repository";
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
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    },
  };
};