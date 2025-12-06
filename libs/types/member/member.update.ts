import { MemberLevel, MemberStatus, MemberType } from "../../enums/member.enum";

export interface MemberUpdate {
  _id: string;
  memberType?: MemberType;
  memberStatus?: MemberStatus;
  memberLevel?: MemberLevel;
  memberPhone?: string;
  memberNick?: string;
  memberPassword?: string;
  memberFullName?: string;
  memberImage?: string;
  memberAddress?: string;
  memberDesc?: string;
}
