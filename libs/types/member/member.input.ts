import {
  MemberAuthType,
  MemberLevel,
  MemberStatus,
  MemberType,
} from "../../enums/member.enum";
import { Direction } from "../../enums/common.enum";

export interface MemberInput {
  memberNick: string;
  memberPassword: string;
  memberPhone: string;
  memberType?: MemberType;
  memberAuthType?: MemberAuthType;
  memberLevel?: MemberLevel;
}

// Login Input

export interface LoginInput {
  memberNick: string;
  memberPassword: string;
}

class BISearch {
  text?: string;
}

// Get Barbers
export interface BarbersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: BISearch;
}

// Admin
interface MISearch {
  memberStatus?: MemberStatus;
  memberType?: MemberType;
  text?: string;
}

export interface MembersInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: MISearch;
}

export interface OrdinaryInquiry {
  page: number;
  limit: number;
}
