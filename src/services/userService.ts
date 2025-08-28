import apiClient from "@/api/apiClient";
import { UserType } from "@/lib/zod/userSchemas";

export const getUserById = async (id: string): Promise<UserType> => {
  const resp = await apiClient.get(`/clientUsers/${id}?includeProfiles=true`);
  return resp.data;
};
