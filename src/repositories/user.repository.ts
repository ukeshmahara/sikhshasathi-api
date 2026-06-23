import UserModel, { IUserDocument } from "../models/user.model";
import { RegisterDtoType } from "../dtos/user.dto";

export const findUserByEmail = async (
  email: string
): Promise<IUserDocument | null> => {
  return UserModel.findOne({ email: email.toLowerCase() });
};

export const createUser = async (
  data: RegisterDtoType & { password: string }
): Promise<IUserDocument> => {
  const user = new UserModel({
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    phoneNumber: data.phoneNumber,
    password: data.password,
  });
  return user.save();
};

export const findUserById = async (
  id: string
): Promise<IUserDocument | null> => {
  return UserModel.findById(id).select("-password");
};

export const updateUserProfilePicture = async (
  id: string,
  profilePicture: string
): Promise<IUserDocument | null> => {
  return UserModel.findByIdAndUpdate(
    id,
    { profilePicture },
    { new: true }
  ).select("-password");
};

export const updateUserById = async (
  id: string,
  data: {
    fullName?: string;
    phoneNumber?: string;
    password?: string;
    profilePicture?: string;
  }
): Promise<IUserDocument | null> => {
  return UserModel.findByIdAndUpdate(id, data, { new: true }).select(
    "-password"
  );
};

export const findUserByIdWithPassword = async (
  id: string
): Promise<IUserDocument | null> => {
  return UserModel.findById(id);
};