import { Role, User } from "@prisma/client";

export const isModerator = (user: User) => user.role === Role.MODERATOR;
export const isAdmin = (user: User) => user.role === Role.ADMIN;

export const isUser = (user: User) => user.role === Role.USER;
