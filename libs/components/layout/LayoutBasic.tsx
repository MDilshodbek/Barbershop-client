import { Stack } from '@mui/material';
import Head from 'next/head';
import Image from 'next/image'; 
import TopBasic from '../TopBasic';
import Footer from '../Footer';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import useDeviceDetect from '../../hooks/useDeviceDetect';
import Top from '../Top';
import Chat from '../Chat';

const withLayoutBasic = (Component: any) => {
	return (props: any) => {
		const device = useDeviceDetect();
		const router = useRouter();

		const memoizedValues = useMemo(() => {
			let title = '',
				desc = '',
				bgImage = '';

			switch (router.pathname) {
				case '/service':
					title = 'Services';
					desc = 'We are glad to see you again!';
					bgImage = '/banner/b1.jpg'; 
					break;
				case '/appointment':
					title = 'Appointment';
					desc = 'Home / Appointment';
					bgImage = '/banner/b5.jpg'; 
					break;
				case '/mypage':
					title = 'My page';
					bgImage = '/banner/b6.jpg'; 
					break;
				case '/community':
					title = 'Community';
					desc = 'Wellcome to our community';
					bgImage = '/banner/b8.jpg'; 
					break;
				case '/community/detail':
					title = 'Community Detail';
					desc = 'Wellcome to our community';
					bgImage = '/banner/b8.jpg'; 
					break;
				case '/faq':
					title = 'FAQ';
					desc = 'Frequently asked questions';
					bgImage = '/banner/b3.jpg'; 
					break;
				case '/notification':
					title = 'Notification';
					desc = 'Notification messages';
					bgImage = '/banner/b5.jpg'; 
					break;
				case '/barber':
					title = 'Barber Page';
					desc = 'Our Barbers';
					bgImage = '/banner/b4.jpg'; 
					break;
				case '/barber/detail':
					title = 'Barber Detail Page';
					desc = 'Our Barbers Info';
					bgImage = '/banner/b4.jpg'; 
				case '/account':
					title = 'Account Join';
					desc = 'Authentication process';
					bgImage = '/banner/b1.jpg'; 
					break;
				default:
					break;
			}

			return { title, desc, bgImage };
		}, [router.pathname]);

		if (device === 'mobile') {
			return (
				<>
					<Head>
						<title>Cropper</title>
						<meta name={'title'} content={`Cropper`} />
					</Head>

					<Stack id="mobile-wrap">
						<Stack id={'top'}>
							<Top />
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		} else {
			return (
				<>
					<Head>
						<title>Cropper</title>
						<meta name={'title'} content={`Cropper`} />
					</Head>

					<Stack id="pc-wrap">
						<Stack id={'top-basic'}>
							<TopBasic />
						</Stack>

						<Stack
							className={`header-basic`}
							sx={{
								position: 'relative', 
								width: '100%',
								overflow: 'hidden',
							}}
						>
							<Image
								src={memoizedValues.bgImage}
								alt={memoizedValues.title ? `${memoizedValues.title} banner` : 'Banner'}
								fill 
								priority 
								sizes="100vw" 
								style={{ objectFit: 'cover' }}
							/>

							<Stack
								sx={{
									position: 'absolute',
									inset: 0,
									boxShadow: 'inset 10px 40px 150px 40px rgb(24 22 36)',
									pointerEvents: 'none',
								}}
							/>
						</Stack>

						<Stack id={'main'}>
							<Component {...props} />
						</Stack>

						<Chat />

						<Stack id={'footer'}>
							<Footer />
						</Stack>
					</Stack>
				</>
			);
		}
	};
};

export default withLayoutBasic;
