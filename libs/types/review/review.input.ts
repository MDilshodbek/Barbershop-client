import { Direction } from "../../enums/common.enum";
import { ReviewGroup, ReviewStatus } from "../../enums/review.enum";

export interface ReviewInput {
  reviewGroup: ReviewGroup;
  reviewContent: string;
  reviewRefId: string;
  rating: number;
  memberId?: string;
  reviewImages?: string[];
}

export interface RISearch {
  reviewRefId: string;
}

export interface ReviewInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: RISearch;
}

export interface AllReviewInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  reviewStatus?: ReviewStatus;
}
