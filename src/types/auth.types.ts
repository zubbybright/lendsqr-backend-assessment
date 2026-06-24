export interface RegisterUserDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  wallet: {
    id: number;
    balance: number;
  };
}