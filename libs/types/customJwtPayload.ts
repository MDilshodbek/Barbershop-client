import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  _id: string;
  memberType: string;
  memberStatus: string;
  memberAuthType: string;
  memberPhone: string;
  memberNick: string;
  memberFullName?: string;
  memberLevel: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
  memberServices: number;
  memberRank: number;
  memberArticles: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberReviews: number;
  memberWarnings: number;
  memberBlocks: number;
}
