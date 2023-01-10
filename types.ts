export interface ILogin {
  email: string;
  password: string;
  token: string;
  roleId: string | null;
}

export type Stock = {
  name: string;
  description: string;
  mrp: number;
  costing: number;
  wholesale: number;
  retail: number;
  quantity: number;
  categoryId: number;
  categoryName: string;
  reminder: number;
};

export type IUser = {
  name: string;
  email: string;
  mrp: string;
  password: string;
  oldPassword: string;
  roleId: number;
  roleName: string;
};
