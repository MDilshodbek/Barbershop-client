import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<meta name="robots" content="index,follow" />
				<link rel="icon" type="image/png" href="/logo/Logo.svg" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link
					rel="preload"
					as="style"
					href="https://fonts.googleapis.com/css2?family=Limelight&family=DM+Sans:wght@400;500;700&display=block"
				/>
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Limelight&family=DM+Sans:wght@400;500;700&display=block"
				/>
				{/* SEO */}
				<meta name="keyword" content={'cropper, cropper.com, barber, hairstyle, haircut, hair modeling, barbershop'} />
				<meta
					name={'description'}
					content={
						'Get haircut, hair modeling, beard styling and other artistic services at cropper! | ' +
						'크로퍼에서 머리 커트, 헤어 모델링, 수염 스타일링 등 다양한 아트 서비스를 받아보세요!| ' +
						'Получите стрижку, моделирование волос, оформление бороды и другие художественные услуги в Cropper! |' +
						'在 Cropper 享受理发、发型设计、胡须造型等多种艺术服务!'
					}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
