import { db } from "../libs/db.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import jwt from "jsonwebtoken";

export const isLoggedIn = async (req, res, next) => {
  console.log(req.cookies);

  console.log("Headers:", {
    cookie: req.headers.cookie,
    authorization: req.headers.authorization,
  });

  let token = req.cookies?.jwtToken;

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer", "").trim();
  }

  console.log("Token Found:", token ? "YES" : "NO");

  if (!token) {
    return res.status(401).json(new ApiResponse(401, "Unauthorized"));
  }

  let decode;

  try {
    decode = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.log(error);
    throw new ApiError(401, "Error in jwt verification");
  }
  const user = await db.user.findUnique({
    where: {
      id: decode.id
    },
    select: {
      id: true,
      image: true,
      name: true,
      email: true,
      role: true
    }
  });

  if (!user) {
    return res.status(404).json(new ApiError(404,"User not found"));
  }

  req.user = user;
  next();
};

export const isAdmin = async (req, res, next) => {
  const userId = req.user.id;
  const user = await db.User.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  console.log(user);
  if (!user || user.role !== "ADMIN") {
    throw new ApiError(403, "Forbidden - you do not have admin access");
  }
  next();
};
