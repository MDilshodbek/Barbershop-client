import { gql } from "@apollo/client";

// Member
export const SIGN_UP = gql`
  mutation Signup($input: MemberInput!) {
    signup(input: $input) {
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

export const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
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

export const UPDATE_MEMBER = gql`
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
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

// Like
export const LIKE_TARGET_MEMBER = gql`
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

// Review
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: ReviewInput!) {
    createReview(input: $input) {
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
    }
  }
`;

export const UPDATE_REVIEW = gql`
  mutation UpdateReview($input: ReviewUpdate!) {
    updateReview(input: $input) {
      _id
      reviewStatus
      reviewContent
      reviewRefId
      memberId
      rating
      reviewImages
      createdAt
      updatedAt
      reviewGroup
    }
  }
`;

// Article
export const CREATE_BOARD_ARTICLE = gql`
  mutation CreateBoardArticle($input: BoardArticleInput!) {
    createBoardArticle(input: $input) {
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

export const UPDATE_BOARD_ARTICLE = gql`
  mutation UpdateBoardArticle($input: BoardArticleUpdate!) {
    updateBoardArticle(input: $input) {
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

// Follow
export const SUBSCRIBE = gql`
  mutation Subscribe($input: String!) {
    subscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($input: String!) {
    unsubscribe(input: $input) {
      _id
      followingId
      followerId
      createdAt
      updatedAt
    }
  }
`;

// Comment
export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentInput!) {
    createComment(input: $input) {
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

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($input: CommentUpdate!) {
    updateComment(input: $input) {
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

// reservation
export const CREATE_RESERVATION = gql`
  mutation CreateReservation($input: ReserveInput!) {
    createReservation(input: $input) {
      _id
      reserveStatus
      barberId
      reserveRefId
      reserveTime
      reserveDay
      reserveNotes
      createdAt
      updatedAt
      reserveEndTime
      serviceDurationMin
      serviceId
      serviceTitle
      servicePrice
    }
  }
`;

export const UPDATE_RESERVATION = gql`
  mutation UpdateReservation($input: ReserveUpdate!) {
    updateReservation(input: $input) {
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
    }
  }
`;

export const CANCEL_RESERVATION = gql`
  mutation CancelReservation($input: CancelReservationInput!) {
    cancelReservation(input: $input) {
      _id
      reserveStatus
      barberId
      reserveRefId
      reserveTime
      reserveDay
      reserveNotes
      createdAt
      updatedAt
      serviceId
      serviceTitle
      servicePrice
      serviceDurationMin
      reserveEndTime
      cancelReason
      cancelledAt
      cancelledById
    }
  }
`;

// Notification
export const MARK_NOTIFICATION_READ = gql`
  mutation MarkNotificationRead($notificationId: String!) {
    markNotificationRead(notificationId: $notificationId) {
      _id
      notificationStatus
      notificationType
      notificationMessage
      authorId
      receiverId
      entityId
      readAt
      createdAt
      updatedAt
    }
  }
`;

export const MARK_ALL_NOTIFICATIONS_READ = gql`
  mutation MarkAllNotificationsRead {
    markAllNotificationsRead {
      _id
      notificationStatus
      notificationType
      notificationMessage
      authorId
      receiverId
      entityId
      readAt
      createdAt
      updatedAt
    }
  }
`;
