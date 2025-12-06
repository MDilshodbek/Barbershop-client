import { gql } from "@apollo/client";

// User

// Service
export const GET_SERVICES = gql`
  query GetServices($input: ServiceInquiry) {
    getServices(input: $input) {
      list {
        _id
        serviceType
        serviceStatus
        serviceTitle
        serviceDuration
        servicePrice
        serviceImages
        serviceDesc
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;

// Barbers
export const GET_BARBERS = gql`
  query GetBarbers($input: BarbersInquiry!) {
    getBarbers(input: $input) {
      list {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

// Articles

export const GET_ARTICLES = gql`
  query GetBoardArticles($input: BoardArticlesInquiry!) {
    getBoardArticles(input: $input) {
      list {
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
        memberData {
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
        meLiked {
          memberId
          likeRefId
          myFavorite
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

// Reviews
export const GET_AllREVIEWS = gql`
  query GetAllReviews($input: AllReviewInquiry!) {
    getAllReviews(input: $input) {
      list {
        _id
        reviewStatus
        reviewContent
        reviewRefId
        memberId
        rating
        reviewImages
        createdAt
        updatedAt
        memberData {
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
      metaCounter {
        total
      }
    }
  }
`;
