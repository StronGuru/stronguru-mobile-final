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

//TODO: crea signupRequest type
export type SignUpResponse = {
  message: string;
  userId?: string;
  error?: Error | null;
};
