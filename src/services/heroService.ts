import apiClient from "@/api/apiClient";
import { HeroResponseType, HeroType } from "../types/heroTypes";

export const getHeroData = async (): Promise<HeroType[]> => {
  try {
    const resp = await apiClient.get<HeroResponseType>("/hero");

    if (!resp.data.success) {
      throw new Error("Failed to fetch hero data");
    }

    return resp.data.data;
  } catch (error: any) {
    console.error("❌ getHeroData failed:");
    console.error("📊 Status:", error.response?.status);
    console.error("📊 Data:", error.response?.data);
    console.error("📊 Message:", error.message);

    if (error.response?.status === 404) {
      throw new Error("Hero data non trovati");
    } else if (error.response?.status >= 500) {
      throw new Error("Errore del server. Riprova più tardi.");
    } else {
      throw new Error(`Errore caricamento hero: ${error.message}`);
    }
  }
};
