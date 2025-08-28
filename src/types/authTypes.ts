// LOGIN
export type SignInRequest = {
  email?: string;
  password?: string;
};

export type SignInResponse = {
  accessToken?: string;
  deviceId?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string;
};

// SIGNUP
export type SignUpResponse = {
  message: string;
  userId?: string;
  activationKey?: string;
  error?: Error | null;
};
// FORGOT PASSWORD
export type ForgotPasswordRequest = {
  email: string;
};
export type ForgotPasswordResponse = {
  message: string;
};
