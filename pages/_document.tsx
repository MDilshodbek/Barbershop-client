import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				{/* Robots */}
				<meta name="robots" content="index,follow" />

				{/* Favicon */}
				<link rel="icon" type="image/png" href="/logo/Logo.jpg" />

				{/* Fonts */}
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
				<meta name="keywords" content="cropper, cropper.com, barber, hairstyle, haircut, hair modeling, barbershop" />

				<meta
					name="description"
					content="Get haircut, hair modeling, beard styling and other artistic services at Cropper!"
				/>

				{/* Open Graph (ALL SOCIAL MEDIA) */}
				<meta property="og:title" content="Cropper — Premium Barber & Hair Styling" />
				<meta
					property="og:description"
					content="Get haircut, hair modeling, beard styling and artistic services at Cropper."
				/>
				<meta property="og:type" content="website" />
				<meta property="og:url" content="https://cropper.studio" />

				{/* IMPORTANT: Public image */}
				<meta property="og:image" content="https://cropper.studio/logo/Logo.jpg" />
				<meta property="og:image:width" content="1200" />
				<meta property="og:image:height" content="630" />

				{/* Twitter / X */}
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Cropper — Premium Barber & Hair Styling" />
				<meta name="twitter:description" content="Premium haircuts, beard styling, and creative grooming at Cropper." />
				<meta name="twitter:image" content="https://cropper.studio/logo/Logo.jpg" />
			</Head>

			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
