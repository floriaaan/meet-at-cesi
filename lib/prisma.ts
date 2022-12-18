// import { commentHistoryMiddleware } from "@/middlewares/prisma/comment";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;
type GlobalWithPrisma = typeof globalThis & {
	prisma: PrismaClient;
};

if (process.env.NODE_ENV === "production") {
	prisma = new PrismaClient();
} else {
	// Ensure the prisma instance is re-used during hot-reloading
	// Otherwise, a new client will be created on every reload
	if (!("prisma" in global)) {
		(global as GlobalWithPrisma).prisma = new PrismaClient();
	}

	prisma = (global as GlobalWithPrisma).prisma;
}
// prisma.$use(commentHistoryMiddleware);

export default prisma;
