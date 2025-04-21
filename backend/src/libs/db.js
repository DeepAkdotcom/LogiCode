import prismaClient from "../generated/prisma/index.js";

const globalForPrisma = globalThis; 

export const db = globalForPrisma.prisma || new prismaClient.PrismaClient();

if(process.env.NODE_ENV !== "production") globalForPrisma.prisma = db


