import { gql } from "@apollo/client";

// MEMBER
export const GET_ALL_MEMBERS_BY_ADMIN = gql`
  query GetAllMembersByAdmin($input: MembersInquiry!) {
    getAllMembersByAdmin(input: $input) {
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
      }
      metaCounter {
        total
      }
    }
  }
`;

// Service
export const GET_SERVICE = gql`
  query GetService($input: String!) {
    getService(serviceId: $input) {
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

export const GET_ALL_SERVICES_BY_ADMIN = gql`
  query GetAllServicesByAdmin($input: ServiceInquiry) {
    getAllServicesByAdmin(input: $input) {
      list {
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
      metaCounter {
        total
      }
    }
  }
`;

// BOARD-ARTICLE
export const GET_ALL_BOARD_ARTICLES_BY_ADMIN = gql`
  query GetAllBoardArticlesByAdmin($input: AllBoardArticlesInquiry!) {
    getAllBoardArticlesByAdmin(input: $input) {
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

// COMMENT
export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentRefId
        memberId
        createdAt
        updatedAt
        memberData {
          _id
          memberType
          memberStatus
          memberAuthType
          memberPhone
          memberNick
          memberFullName
          memberImage
          memberAddress
          memberDesc
          memberWarnings
          memberBlocks
          memberProperties
          memberRank
          memberPoints
          memberLikes
          memberViews
          deletedAt
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

// Reservation

export const GET_ALL_BARBER_SCHEDULES_BY_ADMIN = gql`
  query GetAllBarberSchedules($input: AllBarberScheduleInquiry) {
    getAllBarberSchedules(input: $input) {
      list {
        _id
        reserveStatus
        barberId
        serviceId
        serviceTitle
        servicePrice
        serviceDurationMin
        reserveRefId
        reserveTime
        reserveEndTime
        reserveDay
        reserveNotes
        cancelReason
        cancelledAt
        cancelledById
        createdAt
        updatedAt
        barberData {
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
    }
  }
`;
