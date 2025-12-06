import { gql } from "@apollo/client";

// Like
export const LIKE_BARBER = gql`
  mutation LikeTargetMember($input: String!) {
    likeTargetMember(memberId: $input) {
      _id
      memberType
      memberStatus
      memberAuthType
      memberLevel
      memberServices
      memberPhone
      memberNick
      memberFullName
      memberImage
      memberAddress
      memberDesc
      memberArticles
      memberFollowers
      memberFollowings
      memberPoints
      memberLikes
      memberViews
      memberReviews
      memberComments
      memberRank
      memberWarnings
      memberBlocks
      createdAt
      updatedAt
      accessToken
    }
  }
`;
