import { CommentGroup, CommentStatus } from "../../enums/comment.enum";
import { MeLiked } from "../like/like";
import { Member, TotalCounter } from "../member/member";

export interface Comment {
  _id: string;
  commentStatus: CommentStatus;
  commentGroup: CommentGroup;
  commentContent: string;
  commentTargetId: string;
  memberId: string;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregation **/
  memberData?: Member;
}

export interface Comments {
  list: Comment[];
  metaCounter: TotalCounter[];
}
