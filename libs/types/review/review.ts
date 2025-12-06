import { Member, TotalCounter } from '../member/member';
import { ReviewStatus } from '../../enums/review.enum';

export interface Review {
  _id: string;
  reviewStatus: ReviewStatus;
  reviewContent: string;
  reviewRefId: string;
  memberId: string;
  rating: number;
  reviewImages?: string[];
  createdAt: Date;
  updatedAt: Date;
  memberData?: Member;
}

export interface Reviews {
  list: Review[];
  metaCounter?: TotalCounter[];
}

