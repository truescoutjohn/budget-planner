import prisma from "@/lib/prisma";
import { IUser } from "@/types/user";

const usersRepository = {
  createUser: async (user: IUser): Promise<IUser | null> => {
    return await prisma.user.create({
      data: user,
    });
  },

  findUser: async (email: string): Promise<IUser | null> => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
    });
  },
};

export default usersRepository;
