import { Box, Button, Link, Stack, TextField } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import FacebookOutlinedIcon from '@mui/icons-material/FacebookOutlined';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import XIcon from '@mui/icons-material/X';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import useDeviceDetect from '../hooks/useDeviceDetect';
import { useReactiveVar } from '@apollo/client';
import { userVar } from '../../apollo/store';
import { useTranslation } from 'react-i18next';

const Footer = () => {
	const device = useDeviceDetect();
	const user = useReactiveVar(userVar);
	const { t } = useTranslation('common');

	if (device === 'mobile') {
		return (
			<Stack className="footer-container footer-mobile">
				<Stack className="footer-top">
					<Stack className="signup">
						<h1>{t('Stay up to deals')}</h1>
						<p>{t('Fresh drops, deals, and updates—right to your inbox.')}</p>
					</Stack>
					<Stack className="email">
						<TextField id="standard-email-input" label={t('Email')} type="email" variant="standard" />
						<Button variant="outlined" startIcon={<SendIcon />}>
							{t('Send')}
						</Button>
					</Stack>
					<Stack className="social-media">
						<FacebookOutlinedIcon style={{ color: 'white', fontSize: '26px' }} />
						<InstagramIcon style={{ color: 'white', fontSize: '26px' }} />
						<YouTubeIcon style={{ color: 'white', fontSize: '26px' }} />
						<XIcon style={{ color: 'white', fontSize: '26px' }} />
					</Stack>
				</Stack>

				<Stack className="footer-nav">
					<Link href="service" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Service')}</p>
					</Link>
					<Link href="barber" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Barbers')}</p>
					</Link>
					<Link href="appointment" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Appointment')}</p>
					</Link>
					<Link href="community" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Community')}</p>
					</Link>
					{user?._id && (
						<Link href="/mypage" className="footer-link">
							<ArrowRightIcon style={{ color: '#c6d984' }} />
							<p>{t('My Page')}</p>
						</Link>
					)}
					<Link href="faq" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('FAQ')}</p>
					</Link>
				</Stack>

				<Stack className="footer-bottom">
					<Stack className="schedule">
						<Box>{t('Mon')} : {t('CLOSED')}</Box>
						<Box>{t('Tue')} : 9AM~7PM</Box>
						<Box>{t('Wed')} : 9AM~7PM</Box>
						<Box>{t('Thu')} : 9AM~7PM</Box>
						<Box>{t('Fri')} : 9AM~7PM</Box>
						<Box>{t('Sat')} : 9AM~7PM</Box>
						<Box>{t('Sun')} : 9AM~7PM</Box>
					</Stack>
					<Box className="brand">Cropper © 2025</Box>
				</Stack>
			</Stack>
		);
	} else {
		return (
			<Stack className="container">
				<Stack className="media">
					<Stack className="signup">
						<h1>{t('Sign up For Exclusive Deals and Updates')}</h1>
					</Stack>
					<Stack className="email">
						<TextField id="standard-email-input" label={t('Email')} type="email" variant="standard" />
						<Button variant="outlined" startIcon={<SendIcon />}>
							{t('Send')}
						</Button>
					</Stack>
					<Stack className="social-media">
						<FacebookOutlinedIcon style={{ color: 'white', fontSize: '30px' }} />
						<InstagramIcon style={{ color: 'white', fontSize: '30px' }} />
						<YouTubeIcon style={{ color: 'white', fontSize: '30px' }} />
						<XIcon style={{ color: 'white', fontSize: '30px' }} />
					</Stack>
				</Stack>
				<Stack className="footer-router">
					<Link href="service" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Service')}</p>
					</Link>
					<Link href="barber" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Barbers')}</p>
					</Link>
					<Link href="appointment" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Appointment')}</p>
					</Link>
					<Link href="community" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('Community')}</p>
					</Link>
					{user?._id && (
						<Link href={'/mypage'} className="footer-link">
							<ArrowRightIcon style={{ color: '#c6d984' }} />
							<p>{t('My Page')}</p>
						</Link>
					)}
					<Link href="faq" className="footer-link">
						<ArrowRightIcon style={{ color: '#c6d984' }} />
						<p>{t('FAQ')}</p>
					</Link>
				</Stack>
				<Stack className="schedule">
					<Box>{t('Monday')} ----------------- {t('CLOSED')}</Box>
					<Box>{t('Tuesday')} --------------- 9AM - 7PM</Box>
					<Box>{t('Wednesday')} ------------ 9AM - 7PM</Box>
					<Box>{t('Thursday')} -------------- 9AM - 7PM</Box>
					<Box>{t('Friday')} ----------------- 9AM - 7PM</Box>
					<Box>{t('Saturday')} --------------- 9AM - 7PM</Box>
					<Box>{t('Sunday')} ---------------- 9AM - 7PM</Box>
				</Stack>
			</Stack>
		);
	}
};

export default Footer;
