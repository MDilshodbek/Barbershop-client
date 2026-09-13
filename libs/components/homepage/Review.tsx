import { Box, Rating, Stack, Typography } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import FormatQuoteRoundedIcon from '@mui/icons-material/FormatQuoteRounded';
import { useMemo, useState } from 'react';
import { AllReviewInquiry } from '../../types/review/review.input';
import { Review } from '../../types/review/review';
import { useQuery } from '@apollo/client';
import { GET_AllREVIEWS } from '../../../apollo/user/query';
import { T } from '../../types/common';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import { Direction } from '../../enums/common.enum';
import { useTranslation } from 'react-i18next';
SwiperCore.use([Autoplay, Navigation, Pagination]);

interface ReviewProps {
	initialInput: AllReviewInquiry;
}

export function UserReviews(props: ReviewProps) {
	const slidesOffsetBefore = useMemo(() => {
		// COMMENT: during SSR, window is not defined, so return 0
		if (typeof window === 'undefined') return 0;
		return window.innerWidth * 0.2;
	}, []);

	const { initialInput } = props;
	const [review, setReview] = useState<Review[]>([]);
	const device = useDeviceDetect();
	const { t } = useTranslation('common');

	const {
		loading: getAllReviewsLoading,
		data: getAllReviewsData,
		error: getAllReviewsError,
		refetch: getAllReviewsRefetch,
	} = useQuery(GET_AllREVIEWS, {
		fetchPolicy: 'cache-and-network',
		variables: { input: initialInput },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setReview(data?.getAllReviews?.list);
		},
	});

	if (device === 'mobile') {
		return (
			<div className={'review-frame review-frame-mobile'}>
				<Stack className={'container'}>
					<Stack className="review-box">
						<Typography component="span">
							<Box className="review-main-title">{t('Authentic Testimonials')}</Box>
						</Typography>
						<Typography className="review-subtitle">
							{t('Feedback from clients who loved the Cropper experience')}
						</Typography>
					</Stack>

					<Swiper
						className={'review-info swiper-wrapper review-mobile-swiper'}
						centeredSlides={false}
						slidesPerView={1.1}
						spaceBetween={14}
						autoplay={{
							delay: 3500,
							disableOnInteraction: false,
						}}
						pagination={{
							el: '.swiper-pagination',
							clickable: true,
						}}
					>
						{review.length === 0 ? (
							<Box component={'div'} className="empty-list">
								{t('Reviews are not available')}
							</Box>
						) : (
							<>
								{review.map((review: Review) => {
									return (
										<SwiperSlide className={'review-info-frame review-card'}>
											<Box className="mark">
												<FormatQuoteRoundedIcon
													style={{
														color: '#004034',
														fontSize: '34px',
													}}
												/>
											</Box>
											<Box className="review-comment">{review.reviewContent}</Box>
											<Stack className="review-user">
												<img
													className="review-userimg"
													src={
														review?.memberData?.memberImage
															? `${process.env.REACT_APP_API_URL}/${review?.memberData?.memberImage}`
															: '/logo/defaultUser.svg'
													}
													alt=""
												/>
												<Stack className="review-user-info">
													<Box className="review-username">{review.memberData?.memberNick}</Box>
													<Rating
														sx={{
															'& .MuiRating-iconFilled': {
																color: '#FFD700 !important',
															},
														}}
														value={review.rating}
														readOnly
													/>
												</Stack>
											</Stack>
										</SwiperSlide>
									);
								})}
							</>
						)}
					</Swiper>
					<Box className={'prev-next-frame review-mobile-pagination'}>
						<div className={'dot-frame-pagination swiper-pagination'}></div>
					</Box>
				</Stack>
			</div>
		);
	} else {
		return (
			<div className={'review-frame'}>
				<Stack className={'container'}>
					<Stack className="review-box">
						<Typography component="span">
							<Box className="review-main-title">
								{t('Authentic Testimonials')}
								<br /> {t('From Our Clients')}
							</Box>
						</Typography>
						<Typography className="review-subtitle">
							{t('Read feedbacks from those who have enjoyed and satisfied our services')}
						</Typography>
					</Stack>

					<Swiper
						className={'review-info swiper-wrapper'}
						centeredSlides={false}
						slidesPerView={'auto'}
						slidesOffsetBefore={slidesOffsetBefore}
						spaceBetween={30}
						navigation={{
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						}}
						pagination={{
							el: '.swiper-pagination',
							clickable: true,
						}}
						autoplay={{
							delay: 4000,
							disableOnInteraction: false,
						}}
					>
						{review.length === 0 ? (
							<Box component={'div'} className="empty-list">
								{t('Reviews are not available')}
							</Box>
						) : (
							<>
								{review.map((review: Review) => {
									return (
										<SwiperSlide className={'review-info-frame'}>
											<Box className="mark">
												<FormatQuoteRoundedIcon
													style={{
														color: '#004034',
														fontSize: '40px',
													}}
												/>
											</Box>
											<Box className="review-comment">{review.reviewContent}</Box>
											<Stack className="review-user">
												<img
													className="review-userimg"
													src={
														review?.memberData?.memberImage
															? `${process.env.REACT_APP_API_URL}/${review?.memberData?.memberImage}`
															: '/logo/defaultUser.svg'
													}
													alt=""
												/>
												<Stack className="review-user-info">
													<Box className="review-username">{review.memberData?.memberNick}</Box>
													<Rating
														sx={{
															'& .MuiRating-iconFilled': {
																color: '#FFD700 !important',
															},
														}}
														value={review.rating}
														readOnly
													/>
												</Stack>
											</Stack>
										</SwiperSlide>
									);
								})}
							</>
						)}
					</Swiper>
					<Box className={'prev-next-frame'}>
						<ArrowBackRoundedIcon className={'swiper-button-prev'} />

						<div className={'dot-frame-pagination swiper-pagination'}></div>
						<ArrowBackRoundedIcon className={'swiper-button-next'} style={{ transform: 'rotate(-180deg)' }} />
					</Box>
				</Stack>
			</div>
		);
	}
}

UserReviews.defaultProps = {
	initialInput: {
		page: 1,
		limit: 6,
		direction: Direction.DESC,
		sort: 'createdAt',
		reviewGroup: 'MEMBER',
	},
};
