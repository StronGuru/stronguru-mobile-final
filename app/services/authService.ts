import apiClient from "../../api/apiClient";
import { RegistrationType, SignInRequest, SignInResponse, SignUpResponse } from "../types/authTypes";

export const login = async (payload: SignInRequest): Promise<SignInResponse> => {
  const resp = await apiClient.post("/auth/login", payload);
  return resp.data;
};
//dovrai modificare i type del payload di registrazione qui sotto, MEMO!!
export const register = async (payload: RegistrationType): Promise<SignUpResponse> => {
  const resp = await apiClient.post("/auth/signup/user", payload);
  return resp.data;
};
