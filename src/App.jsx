import { useEffect, useRef } from "react";
import TTS from "./TTS.jsx";
import { useAuth } from "react-oidc-context";
import { gsap } from "gsap";
import {
	Button,
	Box,
	Typography,
	Container,
	CircularProgress,
	Paper,
	Alert,
} from "@mui/material";
import { Login, Logout } from "@mui/icons-material";

function App() {
	const auth = useAuth();
	const containerRef = useRef(null);

	useEffect(() => {
		if (containerRef.current) {
			gsap.from(containerRef.current.children, {
				opacity: 0,
				y: 20,
				stagger: 0.2,
				duration: 0.8,
				ease: "power3.out",
			});
		}
	}, [auth.isAuthenticated]);

	const signOutRedirect = () => {
		const clientId = import.meta.env.VITE_CLIENT_ID;
		// const logoutUri = "http://localhost:5173";
		const logoutUri = import.meta.env.VITE_REDIRECT_URI;
		const cognitoDomain = import.meta.env.VITE_AUTHORITY;
		window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
			logoutUri
		)}`;
	};

	if (auth.isLoading) {
		return (
			<Container
				maxWidth={false}
				disableGutters
				sx={{
					height: "100vh",
					width: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					background:
						"linear-gradient(to bottom right, #1a1a4f, #44336d, #331f54)",
				}}
			>
				<CircularProgress color="secondary" size={60} />
				<Typography variant="h6" ml={2} color="white">
					Loading...
				</Typography>
			</Container>
		);
	}

	if (auth.error) {
		return (
			<Container
				maxWidth={false}
				disableGutters
				sx={{
					height: "100vh",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background:
						"linear-gradient(to bottom right, #1a1a4f, #44336d, #331f54)",
				}}
			>
				<Alert
					severity="error"
					variant="filled"
					sx={{ width: "100%", maxWidth: 500 }}
				>
					Authentication Error: {auth.error.message}
				</Alert>
				<Button
					variant="contained"
					color="secondary"
					sx={{ mt: 2 }}
					onClick={() => auth.signinRedirect()}
				>
					Try Again
				</Button>
			</Container>
		);
	}

	if (auth.isAuthenticated) {
		return (
			<Box
				ref={containerRef}
				sx={{
					width: "100%",
					minHeight: "100vh",
					position: "relative",
					overflow: "visible",
					zIndex: 10,
				}}
			>
				<TTS />
				<Box
					sx={{
						position: "fixed",
						top: 20,
						right: 20,
						zIndex: 15,
					}}
				>
					<Button
						variant="contained"
						color="secondary"
						onClick={() => auth.removeUser()}
						startIcon={<Logout />}
						sx={{
							borderRadius: 2,
							boxShadow: 3,
						}}
					>
						Sign out
					</Button>
				</Box>
			</Box>
		);
	}

	return (
		<Container
			maxWidth={false}
			disableGutters
			sx={{
				height: "100vh",
				width: "100%",
				display: "flex",
				flexDirection: "column",
				justifyContent: "center",
				alignItems: "center",
				background:
					"linear-gradient(to bottom right, #1a1a4f, #44336d, #331f54)",
				m: 0,
				p: 0,
			}}
			ref={containerRef}
		>
			<Paper
				elevation={10}
				sx={{
					p: 5,
					borderRadius: 4,
					background: "rgba(255, 255, 255, 0.1)",
					backdropFilter: "blur(10px)",
					maxWidth: 500,
					width: "90%",
					textAlign: "center",
				}}
			>
				<Typography
					variant="h3"
					component="h1"
					mb={3}
					color="white"
					fontWeight="bold"
				>
					Speakify
				</Typography>
				<Typography variant="subtitle1" color="lightgrey" mb={5}>
					Convert your text into natural-sounding speech with our powerful AI
					technology
				</Typography>

				<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => auth.signinRedirect()}
						startIcon={<Login />}
						sx={{
							px: 4,
							py: 1.5,
							borderRadius: 2,
							background: "linear-gradient(to right, #8e2de2, #4a00e0)",
							"&:hover": {
								background: "linear-gradient(to right, #7d28c5, #3900b3)",
							},
						}}
					>
						Sign in/Sign up
					</Button>
				</Box>
			</Paper>

			<Typography
				variant="body2"
				color="lightgrey"
				mt={4}
				sx={{ opacity: 0.7 }}
			>
				© 2025 Speakify. All rights reserved.
			</Typography>
		</Container>
	);
}

export default App;
