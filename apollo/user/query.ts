import { gql } from "@apollo/client";

// Member
export const GET_MEMBER = gql`
  query GetMember($input: String!) {
    getMember(memberId: $input) {
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
      meFollowed {
        followingId
        followerId
        myFollowing
      }
    }
  }
`;

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

export const GET_FAVORITE_MEMBERS = gql`
  query GetFavoriteMembers($input: OrdinaryInquiry!) {
    getFavoriteMembers(input: $input) {
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

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

export const GET_BOARD_ARTICLE = gql`
  query GetBoardArticle($input: String!) {
    getBoardArticle(articleId: $input) {
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
  }
`;

// Reviews
export const GET_AllREVIEWS = gql`
  query GetAllReviews($input: AllReviewInquiry!) {
    getAllReviews(input: $input) {
      list {
        _id
        reviewStatus
        reviewGroup
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

export const GET_REVIEWS = gql`
  query GetReviews($input: ReviewInquiry!) {
    getReviews(input: $input) {
      list {
        _id
        reviewStatus
        reviewGroup
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

// Follow
export const GET_MEMBER_FOLLOWERS = gql`
  query GetMemberFollowers($input: FollowInquiry!) {
    getMemberFollowers(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followerData {
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

export const GET_MEMBER_FOLLOWINGS = gql`
  query GetMemberFollowings($input: FollowInquiry!) {
    getMemberFollowings(input: $input) {
      list {
        _id
        followingId
        followerId
        createdAt
        updatedAt
        followingData {
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
        meFollowed {
          followingId
          followerId
          myFollowing
        }
      }
      metaCounter {
        total
      }
    }
  }
`;

// Comment
export const GET_COMMENTS = gql`
  query GetComments($input: CommentsInquiry!) {
    getComments(input: $input) {
      list {
        _id
        commentStatus
        commentGroup
        commentContent
        commentTargetId
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
        }
      }
      metaCounter {
        total
      }
    }
  }
`;
