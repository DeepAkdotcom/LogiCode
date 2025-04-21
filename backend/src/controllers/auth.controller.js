import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import {sendResetPasswordMail,sendVerificationMail} from "../utils/nodemailer.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const registerUser = async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password || !phone) {
    res.status(400),
      json({
        success: false,
        message: "Please fill all the fields",
      });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "user already exists",
      });
    }

    //hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    //create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        verificationToken: verificationToken,
      },
    });
    console.log(user);

    //send mail
    await sendVerificationMail(verificationToken);

    res.status(201).json({
      success: true,
      message: "User registered succesfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      err,
      message: "user not registered",
    });
  }
};

const verifyUser = async (req, res) => {
  const { token } = req.params;
  console.log(token);

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Invalid Token",
    });
  }
  try {
    console.log("in try");

    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    console.log("verify route: ", user);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });
    console.log("after update", updatedUser);

    res.status(200).json({
      success: true,
      message: "User verified succesfully!",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      err,
      message: "User not verified!",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Incorrect email or password",
    });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { email: email },
    });

    //check useer based on email
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    //check password
    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
      return res.status(400).json({
        success: false,
        message: "password incorrect",
      });
    }

    console.log(user.isVerified);
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "user is not verified",
      });
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

    res.status(200).json({
      success: true,
      message: "login success",
      jwtToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: "login failed",
    });
  }
};

const profile = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        password: false,
        email: true,
        name: true,
        phone: true,
        isVerified: true,
        role: true,
      }
    });
        
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      err,
      message: "user is not authenticated",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("jwtToken", " ", {
      expires: new Date(0),
    });
    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Log out failed",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user  = await prisma.user.findFirst({
        where: {email}
    })
    console.log(user);
    if(!user){
        res.status(400).json({
            success: false,
            message: "User not found"
        })
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const updatesuser = await prisma.user.update({
        where: {id: user.id},
        data: {
            resetToken,
            resetExpiry: new Date(Date.now() + 10 * 60 * 1000) //10min
        }
    })
    console.log(updatesuser);

    await sendResetPasswordMail(resetToken);

    res.status(200).json({
        success: true,
        message: "Reset password link sent to your email"
    })

  } catch (err) {
    res.status(400).json({
        success: false,
        message: "Failed to send reset password link"
    })
  }
};

const resetpassword = async (req, res) => {
    try {
        const {password, confirmPassword} = req.body;
        const {token} = req.params;
        
        if(!password || !confirmPassword){
            return res.status(400).json({
                success: false,
                message: "Password and confirm password are required"
            })
        }

        if(password !== confirmPassword){
            res.status(400).json({
                success: false,
                message: "Password and confirm password do not match"
            })
        }
        console.log("brfore user check")
        console.log(token);
        const user = await prisma.user.findFirst({
            where: {
                resetToken : token,
                resetExpiry: {gt: new Date()}
            }
        })

        console.log(user); 
        const hashedPasswd = await bcrypt.hash(password, 10);

        const updatedUser = await prisma.user.update({
            where: {id: user.id},
            data: {
                password: hashedPasswd,
                resetToken: null,
                resetExpiry: null
            }
        })

        console.log(updatedUser);

        res.status(200).json({
            success: true,
            message: "Password reset successful"
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Failed to reset password"
        })
    }
};

export { registerUser, verifyUser, loginUser, profile, logoutUser, forgotPassword, resetpassword };
