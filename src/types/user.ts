export interface IUser {
  email: string;
  password: string;
  name?: string;
  locale?: string;
}

export interface IRegisterUser extends IUser {
  confirmPassword: string;
}

export interface IUserRepository {
  createUser: (user: IUser) => Promise<IUser | null>;
  findUser: (email: string) => Promise<IUser | null>;
}
