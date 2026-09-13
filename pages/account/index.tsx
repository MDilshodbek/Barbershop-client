import React, { useCallback, useState } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import {
	Box,
	Button,
	Stack,
	TextField,
	Typography,
	IconButton,
	FormGroup,
	FormControlLabel,
	Checkbox,
} from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FacebookIcon from '@mui/icons-material/Facebook';
import GoogleIcon from '@mui/icons-material/Google';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { useTranslation } from 'react-i18next';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const Join: NextPage = () => {
	const { t, i18n } = useTranslation('common');
	const router = useRouter();
	const device = useDeviceDetect();
	const [rightActive, setRightActive] = useState(false);
	const [input, setInput] = useState({
		nick: '',
		password: '',
		phone: '',
		type: 'USER',
	});

	/** HANDLERS **/

	const checkUserTypeHandler = (e: any) => {
		const checked = e.target.checked;
		if (checked) {
			const value = e.target.name;
			handleInput('type', value);
		} else {
			handleInput('type', 'USER');
		}
	};

	const handleInput = useCallback((name: any, value: any) => {
		setInput((prev) => {
			return { ...prev, [name]: value };
		});
	}, []);

	const doLogin = useCallback(async () => {
		console.warn(input);
		try {
			await logIn(input.nick, input.password);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			const message = err?.graphQLErrors?.[0]?.message || err?.message || t('Login failed');

			await sweetMixinErrorAlert(message, 1500);
		}
	}, [input, router]);

	const doSignUp = useCallback(async () => {
		console.warn(input);
		try {
			await signUp(input.nick, input.password, input.phone, input.type);
			await router.push(`${router.query.referrer ?? '/'}`);
		} catch (err: any) {
			const message = err?.graphQLErrors?.[0]?.message || err?.message || t('Signup failed');

			await sweetMixinErrorAlert(message, 1500);
		}
	}, [input, router]);

	if (device === 'mobile') {
		return (
			<Stack className="join-page-mobile">
				<Stack className="brand-logo-box">
					<img className="brand-logo" src="/logo/Logo2.png" alt="" />
					<span className="brand-name">Cropper</span>
				</Stack>
				<Typography className="join-title">
					{rightActive ? t('Hello, Gentleman!') : t('Welcome Back!')}
				</Typography>
				<Typography className="join-subtitle">
					{rightActive
						? t('Enter your personal details and start your') + ' ' + t('journey with us.')
						: t('To keep connected with us') + ' ' + t('please login with your personal info')}
				</Typography>

				<Stack className="auth-tabs-mobile">
					<button
						type="button"
						className={!rightActive ? 'active' : ''}
						onClick={() => setRightActive(false)}
					>
						{t('Login')}
					</button>
					<button
						type="button"
						className={rightActive ? 'active' : ''}
						onClick={() => setRightActive(true)}
					>
						{t('Register')}
					</button>
				</Stack>

				{!rightActive ? (
					<form className="auth-form-mobile">
						<TextField
							fullWidth
							variant="filled"
							label={t('Nickname')}
							onChange={(e) => handleInput('nick', e.target.value)}
						/>
						<TextField
							fullWidth
							variant="filled"
							label={t('Password')}
							type="password"
							onChange={(e) => handleInput('password', e.target.value)}
							onKeyDown={(event) => {
								if (event.key == 'Enter') doLogin();
							}}
						/>

						<Typography className="subtitle">{t('login with')}</Typography>
						<Stack direction="row" spacing={1} className="social-container">
							<IconButton className="social">
								<FacebookIcon />
							</IconButton>
							<IconButton className="social">
								<GoogleIcon />
							</IconButton>
							<IconButton className="social">
								<LinkedInIcon />
							</IconButton>
						</Stack>

						<Button
							variant="contained"
							className="main-btn"
							disabled={input.nick === '' || input.password === ''}
							onClick={doLogin}
						>
							{t('LOGIN')}
						</Button>
					</form>
				) : (
					<form className="auth-form-mobile">
						<TextField
							fullWidth
							variant="filled"
							label={t('Nickname')}
							onChange={(e) => handleInput('nick', e.target.value)}
						/>
						<TextField
							fullWidth
							variant="filled"
							label={t('Phone number')}
							onChange={(e) => handleInput('phone', e.target.value)}
						/>
						<TextField
							fullWidth
							variant="filled"
							label={t('Password')}
							type="password"
							onChange={(e) => handleInput('password', e.target.value)}
							onKeyDown={(event) => {
								if (event.key == 'Enter') doSignUp();
							}}
						/>

						<Box className="register">
							<div className="type-option">
								<span className="text">{t('I want to be registered as:')}</span>
								<div className="checkbox-column">
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name="USER"
													onChange={checkUserTypeHandler}
													checked={input.type === 'USER'}
												/>
											}
											label={t('User')}
										/>
									</FormGroup>
									<FormGroup>
										<FormControlLabel
											control={
												<Checkbox
													size="small"
													name="BARBER"
													onChange={checkUserTypeHandler}
													checked={input.type === 'BARBER'}
												/>
											}
											label={t('Barber')}
										/>
									</FormGroup>
								</div>
							</div>

							<Typography className="subtitle">{t('register with')}</Typography>
							<Stack className="social-container">
								<IconButton className="social">
									<FacebookIcon />
								</IconButton>
								<IconButton className="social">
									<GoogleIcon />
								</IconButton>
								<IconButton className="social">
									<LinkedInIcon />
								</IconButton>
							</Stack>

							<Button
								variant="contained"
								className="main-btn"
								disabled={input.nick === '' || input.password === '' || input.phone === '' || input.type === ''}
								onClick={doSignUp}
							>
								{t('SIGNUP')}
							</Button>
						</Box>
					</form>
				)}
			</Stack>
		);
	} else {
		return (
			<Stack className="join-page">
				<Typography className="join-title">{t('Welcome')}</Typography>
				<Stack className="container">
					<Box className={`auth-container ${rightActive ? 'right-panel-active' : ''}`}>
						{/* SIGN UP PANEL */}
						<Stack className="form-container sign-up-container">
							<form>
								<Typography className="title">{t('Create Account')}</Typography>

								<TextField
									fullWidth
									variant="filled"
									label={t('Nickname')}
									onChange={(e) => handleInput('nick', e.target.value)}
								/>
								<TextField
									fullWidth
									variant="filled"
									label={t('Phone number')}
									onChange={(e) => handleInput('phone', e.target.value)}
								/>
								<TextField
									fullWidth
									variant="filled"
									label={t('Password')}
									type="password"
									onChange={(e) => handleInput('password', e.target.value)}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doSignUp();
									}}
								/>

								<Box className="register">
									<div className="type-option">
										<span className="text">{t('I want to be registered as:')}</span>

										<div className="checkbox-column">
											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name="USER"
															onChange={checkUserTypeHandler}
															checked={input.type === 'USER'}
														/>
													}
													label={t('User')}
												/>
											</FormGroup>

											<FormGroup>
												<FormControlLabel
													control={
														<Checkbox
															size="small"
															name="BARBER"
															onChange={checkUserTypeHandler}
															checked={input.type === 'BARBER'}
														/>
													}
													label={t('Barber')}
												/>
											</FormGroup>
										</div>
									</div>

									<Typography className="subtitle">{t('register with')}</Typography>

									<Stack className="social-container">
										<IconButton className="social">
											<FacebookIcon />
										</IconButton>
										<IconButton className="social">
											<GoogleIcon />
										</IconButton>
										<IconButton className="social">
											<LinkedInIcon />
										</IconButton>
									</Stack>

									<Button
										variant="contained"
										className="main-btn"
										disabled={input.nick === '' || input.password === '' || input.phone === '' || input.type === ''}
										onClick={doSignUp}
									>
										{t('SIGNUP')}
									</Button>
								</Box>
							</form>
						</Stack>

						{/* LOG IN PANEL */}
						<Stack className="form-container sign-in-container">
							<form>
								<Typography className="title">{t('Login')}</Typography>

								<TextField
									fullWidth
									variant="filled"
									label={t('Nickname')}
									onChange={(e) => handleInput('nick', e.target.value)}
								/>
								<TextField
									fullWidth
									variant="filled"
									label={t('Password')}
									type="password"
									onChange={(e) => handleInput('password', e.target.value)}
									onKeyDown={(event) => {
										if (event.key == 'Enter') doLogin();
									}}
								/>

								<Typography className="subtitle">{t('login with')}</Typography>

								<Stack direction="row" spacing={1} className="social-container">
									<IconButton className="social">
										<FacebookIcon />
									</IconButton>
									<IconButton className="social">
										<GoogleIcon />
									</IconButton>
									<IconButton className="social">
										<LinkedInIcon />
									</IconButton>
								</Stack>

								<Button
									variant="contained"
									className="main-btn"
									disabled={input.nick === '' || input.password === ''}
									onClick={doLogin}
								>
									{t('LOGIN')}
								</Button>
							</form>
						</Stack>

						{/* OVERLAY PANELS (same as before) */}
						<Box className="overlay-container">
							<Box className="overlay">
								<Box className="overlay-panel overlay-left">
									<Stack className="overlay-main-left">
										<Stack className="brand-logo-box">
											<img className="brand-logo" src="/logo/Logo2.png" alt="" />
											<span className="brand-name">Cropper</span>
										</Stack>
										<Typography variant="h4">{t('Welcome Back!')}</Typography>
										<Typography>
											{t('To keep connected with us')} <br /> {t('please login with your personal info')}
										</Typography>
										<Button className="ghost-btn" onClick={() => setRightActive(false)}>
											{t('LogIn')}
										</Button>
									</Stack>
								</Box>

								<Box className="overlay-panel overlay-right">
									<Stack className="overlay-main">
										<Stack className="brand-logo-box">
											<img src="/logo/Logo2.png" alt="" />
											<span className="brand-name">Cropper</span>
										</Stack>
										<Typography variant="h4">{t('Hello, Gentleman!')}</Typography>
										<Typography>
											{t('Enter your personal details and start your')} <br /> {t('journey with us.')}
										</Typography>
										<Button className="ghost-btn" onClick={() => setRightActive(true)}>
											{t('Sign Up')}
										</Button>
									</Stack>
								</Box>
							</Box>
						</Box>
					</Box>
				</Stack>
			</Stack>
		);
	}
};

export default withLayoutBasic(Join);
