import { Club } from "./club";

export type ClubApplyStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";

export type Application = {
  id: number;
  club: Club;
  introduction: string;
  experience: string;
  motivation: string;
  status: ClubApplyStatus;
};
