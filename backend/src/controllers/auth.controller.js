import bcrypt from "bcryptjs";
import crypto from "crypto";
import {
  sendResetPasswordMail,
  sendVerificationMail,
} from "../utils/nodemailer.js";
import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Please fill all the fields.");
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(409, "The user is already created.");
  }

  //hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  //create user
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      verificationToken: verificationToken,
    },
  });
  console.log(user);

  //send mail
  await sendVerificationMail(verificationToken);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        user,
        "User registered Successfully. Check your Email "
      )
    );
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  if (!token) {
    throw new ApiError(500, "Unable to verify User");
  }

  const user = await db.user.findFirst({
    where: { verificationToken: token },
  });

  // console.log("verify route: ", user);

  if (!user) {
    throw new ApiError(500, "Unable to verify User");
  }

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
    },
  });
  // console.log("after update", updatedUser);

  return res
    .status(201)
    .json(new ApiResponse(201, updatedUser, "User verified Succesfully"));
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Incorrect email or password");
  }

  const user = await db.user.findUnique({
    where: { email: email },
  });

  //check useer based on email
  if (!user) {
    throw new ApiError(404, "User not found, create user first");
  }

  //check password
  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) {
    throw new ApiError(400, "Incorrect password, not matched");
  }

  // console.log(user.isVerified);

  if (!user.isVerified) {
    throw new ApiError(400, "User is not verified");
  }

  const jwtToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  console.log(jwtToken);

  //store in cookie
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("jwtToken", jwtToken, cookieOptions);

  let data = {
    jwtToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    },
  };

  return res.status(200).json(new ApiResponse(200, data, "Login Success"));
};

const profile = async (req, res) => {
  const id = req.user.id;
  const user = await db.user.findUnique({
    where: { id },
    select: {
      password: false,
      email: true,
      name: true,
      isVerified: true,
      role: true,
    },
  });

  if (!user) {
    throw new ApiError(400, "user not found, create user first");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Profile fetched successfully"));
};

const logoutUser = async (req, res) => {
  res.clearCookie("jwtToken", " ", {
    expires: new Date(0),
  });

  return res.status(201).json(new ApiResponse(201, null, "Logged out"));
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await db.user.findFirst({
    where: { email },
  });

  console.log(user);

  if (!user) {
    throw new ApiError(400, "User not found, create user first");
  }

  const resetToken = crypto.randomBytes(32).toString("hex");

  const updatesuser = await db.user.update({
    where: { id: user.id },
    data: {
      resetToken,
      resetExpiry: new Date(Date.now() + 10 * 60 * 1000), //10min
    },
  });

  console.log(updatesuser);

  await sendResetPasswordMail(resetToken);

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Reset password link sent to your email"));
};

const resetpassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  const { token } = req.params;

  if (!password || !confirmPassword) {
    throw new ApiError(400, "Password and confirm password are required");
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Password and confirm password do not match");
  }

  console.log("brfore user check");
  console.log(token);

  const user = await db.user.findFirst({
    where: {
      resetToken: token,
      resetExpiry: { gt: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  console.log(user);

  const hashedPasswd = await bcrypt.hash(password, 10);

  const updatedUser = await db.user.update({
    where: { id: user.id },
    data: {
      password: hashedPasswd,
      resetToken: null,
      resetExpiry: null,
    },
  });

  console.log(updatedUser);

  return res
    .status(201)
    .json(new ApiResponse(201, null, "Password reset successful"));
};

export {
  registerUser,
  verifyUser,
  loginUser,
  profile,
  logoutUser,
  forgotPassword,
  resetpassword,
};
