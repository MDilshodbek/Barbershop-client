import { CommentGroup } from "../../enums/comment.enum";
import { Direction } from "../../enums/common.enum";

export interface CommentInput {
  commentGroup: CommentGroup;
  commentContent: string;
  commentTargetId: string;
  memberId?: string;
}

interface CISearch {
  commentTargetId: string;
}

export interface CommentsInquiry {
  page: number;
  limit: number;
  sort?: string;
  direction?: Direction;
  search: CISearch;
}
