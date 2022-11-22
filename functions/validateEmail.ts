import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

// validate email if finish by @viacesi.fr
const regex = new RegExp(/@viacesi.fr$/);
export const checkEmail = (email: string) => regex.test(email);

/**
 * validateEmail() is a function that takes a user as parameter and returns a boolean.
 *  It checks if the email is valid and if :
 *  - it is, it updates the user in the database and returns true
 *  - if the email is not valid, it returns false.
 * */
export default async function validateEmail(user: User): Promise<boolean> {
  if (!user.id) throw new Error("User id is undefined");
  if (!user.email) throw new Error("Email is required");
  const isValid = checkEmail(user.email);
  if (!isValid) return false;

  const result = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });

  return result !== null;
}
