export type CreateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type SearchUser = {
    name: string;
    email: string;
    page: number;
    size: number;
}

export type UpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};