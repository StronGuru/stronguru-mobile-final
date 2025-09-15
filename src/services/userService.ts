import apiClient from "@/api/apiClient";
import { ProfileType, UserType } from "@/lib/zod/userSchemas";

export const getUserById = async (id: string): Promise<UserType> => {
  const resp = await apiClient.get(`/clientUsers/${id}?includeProfiles=true`);
  return resp.data;
};
//da eliminare
export const getUserProfessionalsByUserId = async (id: string): Promise<ProfileType[]> => {
  const resp = await apiClient.get(`/clientUsers/${id}/clientUserProfiles`);
  return resp.data;
};
