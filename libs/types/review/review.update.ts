import { ReviewGroup, ReviewStatus } from "../../enums/review.enum";

export interface ReviewUpdate {
  _id: string;
  reviewStatus?: ReviewStatus;
  reviewGroup?: ReviewGroup;
  reviewRefId?: string;
  reviewContent?: string;
  reviewImages?: string[];
  rating?: number;
}
