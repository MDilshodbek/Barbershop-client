import { gql } from "@apollo/client";

// MEMBER
export const UPDATE_MEMBER_BY_ADMIN = gql`
  mutation UpdateMemberByAdmin($input: MemberUpdate!) {
    updateMemberByAdmin(input: $input) {
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

// Service
export const CREATE_SERVICE = gql`
  mutation CreateService($input: ServiceInput!) {
    createService(input: $input) {
      _id
      serviceType
      serviceStatus
      serviceTitle
      serviceDuration
      servicePrice
      serviceImages
      serviceReviews
      serviceDesc
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: ServiceUpdate!) {
    updateService(input: $input) {
      _id
      serviceType
      serviceStatus
      serviceTitle
      serviceDuration
      servicePrice
      serviceImages
      serviceDesc
      serviceReviews
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_SERVICE = gql`
  mutation RemoveService($_id: String!) {
    removeService(_id: $_id)
  }
`;


// BOARD-ARTICLE     
export const UPDATE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation UpdateBoardArticleByAdmin($input: BoardArticleUpdate!) {
    updateBoardArticleByAdmin(input: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
    }
  }
`;

export const REMOVE_BOARD_ARTICLE_BY_ADMIN = gql`
  mutation RemoveBoardArticleByAdmin($input: String!) {
    removeBoardArticleByAdmin(articleId: $input) {
      _id
      articleCategory
      articleStatus
      articleTitle
      articleContent
      articleImage
      articleViews
      articleLikes
      articleComments
      memberId
      createdAt
      updatedAt
    }
  }
`;


// COMMENT        
export const REMOVE_COMMENT_BY_ADMIN = gql`
  mutation RemoveCommentByAdmin($input: String!) {
    removeCommentByAdmin(commentId: $input) {
      _id
      commentStatus
      commentGroup
      commentContent
      commentTargetId
      memberId
      createdAt
      updatedAt
    }
  }
`;
