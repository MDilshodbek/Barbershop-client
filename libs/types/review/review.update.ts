import { ReviewStatus } from "../../enums/review.enum";

export interface ReviewUpdate {
  _id: string;
  reviewStatus?: ReviewStatus;
  reviewContent?: string;
  reviewImages?: string[];
  rating?: number;
}
