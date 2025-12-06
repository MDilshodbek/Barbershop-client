import {
  MemberAuthType,
  MemberLevel,
  MemberStatus,
  MemberType,
} from "../../enums/member.enum";
import { MeFollowed } from "../follow/follow";
import { MeLiked } from "../like/like";



export interface Member {
  _id: string;
  memberType: MemberType;
  memberStatus: MemberStatus;
  memberAuthType: MemberAuthType;
  memberLevel: MemberLevel;
  memberServices: number;
  memberPhone: string;
  memberNick: string;
  memberPassword?: string;
  memberFullName?: string;
  memberImage: string;
  memberAddress?: string;
  memberDesc?: string;
  memberArticles: number;
  memberFollowers: number;
  memberFollowings?: number;
  memberPoints: number;
  memberLikes: number;
  memberViews: number;
  memberReviews: number;
  memberComments: number;
  memberRank: number;
  memberWarnings: number;
  memberBlocks: number;
  createdAt: Date;
  updatedAt: Date;
  // Enable for authentications
  accessToken?: string;
  meLiked?: MeLiked[];
  meFollowed?: MeFollowed[];
}

export interface TotalCounter {
  total: number;
}

export interface Members {
  list: Member[];
  metaCounter: TotalCounter[];
}
