import apiClient from "@/api/apiClient";
import { ProfileType, UserType } from "@/lib/zod/userSchemas";

export type UserPatchResponse = {
  clientUserId?: string;
  message?: string;
  success?: boolean;
  error?: string | null;
};

export const getUserById = async (id: string): Promise<UserType> => {
  const resp = await apiClient.get(`/clientUsers/${id}?includeProfiles=true`);
  return resp.data;
};
//da eliminare
export const getUserProfessionalsByUserId = async (id: string): Promise<ProfileType[]> => {
  const resp = await apiClient.get(`/clientUsers/${id}/clientUserProfiles`);
  return resp.data;
};

export const patchUser = async (id: string, data: Partial<UserType>): Promise<UserPatchResponse> => {
  try {
    const resp = await apiClient.patch(`/clientUsers/${id}`, data);
    console.log("📥 PATCH Response status:", resp.status);
    console.log("📥 PATCH Response data:", resp.data);
    return resp.data;
  } catch (error: any) {
    console.error("❌ patchUser failed:");
    console.error("📊 Status:", error.response?.status);
    console.error("📊 Data:", error.response?.data);
    console.error("📊 Message:", error.message);
    if (error.response?.status === 400) {
      throw new Error(`Dati non validi: ${error.response.data?.error || error.message}`);
    } else if (error.response?.status === 404) {
      throw new Error("Utente non trovato");
    } else if (error.response?.status >= 500) {
      throw new Error("Errore del server. Riprova più tardi.");
    } else {
      throw new Error(`Errore aggiornamento profilo: ${error.message}`);
    }
  }
};
