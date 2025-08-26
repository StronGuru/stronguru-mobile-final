import apiClient from "../../api/apiClient";
import { SignInRequest, SignInResponse } from "../types/authTypes";

export const login = async (payload: SignInRequest): Promise<SignInResponse> => {
  const resp = await apiClient.post("/auth/login", payload);
  return resp.data;
};
//dovrai modificare i type del payload di registrazione qui sotto, MEMO!!
export const register = async (email: string, password: string, name: string) => {
  const resp = await apiClient.post("/auth/register", { email, password, name });
  return resp.data;
};
