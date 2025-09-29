export type HeroType = {
  _id: string;
  homeTitle: string;
  homeSubtitle: string;
  homeImage: string;
  detailTitle: string;
  detailSubtitle: string;
  detailImage: string;
  detailUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type HeroResponseType = {
  success: boolean;
  data: HeroType[];
};
