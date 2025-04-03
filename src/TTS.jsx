import { useState, useEffect, useRef } from "react";
import { Volume2 } from "lucide-react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useAuth } from "react-oidc-context";
import { gsap } from "gsap";
import {
	Box,
	TextField,
	Button,
	Container,
	Typography,
	Paper,
	CircularProgress,
	Card,
	CardContent,
	Divider,
	IconButton,
	Fade,
	Grid,
	Tooltip,
} from "@mui/material";
import {
	VolumeUp,
	HistoryToggleOff,
	Info,
	Download,
} from "@mui/icons-material";

export default function TTS() {
	const auth = useAuth();
	const [text, setText] = useState("");
	const [audioUrl, setAudioUrl] = useState("");
	const [loading, setLoading] = useState(false);
	const { enqueueSnackbar } = useSnackbar();
	const pageRef = useRef(null);
	const audioControlsRef = useRef(null);
	const textAreaRef = useRef(null);
	const [recentHistory, setRecentHistory] = useState([]);

	// Add a placeholder in history when component mounts
	useEffect(() => {
		setRecentHistory([
			{
				text: "Welcome to Speakify! Try your first text-to-speech conversion.",
				timestamp: new Date(),
			},
		]);
	}, []);

	// GSAP animations with delay to ensure proper rendering
	useEffect(() => {
		const timer = setTimeout(() => {
			const tl = gsap.timeline();

			if (pageRef.current) {
				// console.log(
				// 	"Header elements:",
				// 	pageRef.current.querySelectorAll(".header-animation")
				// );
				// console.log(
				// 	"Content elements:",
				// 	pageRef.current.querySelectorAll(".content-animation")
				// );

				gsap.set(".header-animation, .content-animation", { opacity: 1, y: 0 });

				tl.from(".header-animation", {
					y: -50,
					opacity: 0,
					duration: 0.8,
					ease: "power3.out",
				});

				tl.from(
					".content-animation",
					{
						opacity: 0,
						y: 30,
						stagger: 0.15,
						duration: 0.7,
						ease: "power2.out",
					},
					"-=0.4"
				);
			}
		}, 500);

		return () => clearTimeout(timer);
	}, []);

	// Audio controls animation
	useEffect(() => {
		if (audioUrl && audioControlsRef.current) {
			gsap.fromTo(
				audioControlsRef.current,
				{ scale: 0.8, opacity: 0 },
				{
					scale: 1,
					opacity: 1,
					duration: 0.5,
					ease: "back.out(1.7)",
				}
			);
		}
	}, [audioUrl]);

	const handleGenerateAudio = async () => {
		if (!text) {
			enqueueSnackbar("Please enter some text to convert", {
				variant: "warning",
			});
			return;
		}

		setLoading(true);
		try {
			if (textAreaRef.current) {
				gsap.to(textAreaRef.current, {
					boxShadow: "0 0 0 2px #8e2de2",
					duration: 0.3,
				});
			}

			const apiUrl = import.meta.env.VITE_APIURL;

			const response1 = await axios.post(
				apiUrl,
				{
					text,
				},
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${auth.user?.access_token}`,
					},
				}
			);

			const response = response1.data;

			if (response.fileUrl) {
				enqueueSnackbar("Audio generated successfully", { variant: "success" });
				const timestamp = new Date().getTime();
				setAudioUrl(`${response.fileUrl}?t=${timestamp}`);

				setRecentHistory((prev) => [
					{
						text: text.substring(0, 50) + (text.length > 50 ? "..." : ""),
						timestamp: new Date(),
					},
					...prev.slice(0, 2),
				]);
			} else {
				throw new Error("No audio URL received");
			}
		} catch (error) {
			console.error("Error generating audio:", error);
			if (error.response) {
				enqueueSnackbar(
					error.response.data?.error ||
						"Error generating audio. Please try again.",
					{ variant: "error" }
				);
			} else if (error.request) {
				enqueueSnackbar(
					"Failed to connect to the server. Please check your network or CORS settings.",
					{ variant: "error" }
				);
			} else {
				enqueueSnackbar("An unexpected error occurred. Please try again.", {
					variant: "error",
				});
			}
			setAudioUrl("");
		} finally {
			setLoading(false);
			if (textAreaRef.current) {
				gsap.to(textAreaRef.current, {
					boxShadow: "none",
					duration: 0.3,
				});
			}
		}
	};

	return (
		<Container
			ref={pageRef}
			maxWidth={false}
			disableGutters
			sx={{
				width: "100%",
				minHeight: "100vh",
				pt: 5,
				pb: 10,
				background:
					"linear-gradient(135deg, #1a1a4f 0%, #44336d 50%, #331f54 100%)",
				m: 0,
				display: "block",
				position: "relative",
				zIndex: 15,
				overflow: "visible",
			}}
		>
			{/* Header */}
			<Box
				className="header-animation"
				textAlign="center"
				mb={6}
				sx={{ width: "100%" }}
			>
				<Typography
					variant="h2"
					component="h1"
					fontWeight="bold"
					color="white"
					sx={{
						background: "linear-gradient(to right, #fff, #c4b5fd)",
						WebkitBackgroundClip: "text",
						WebkitTextFillColor: "transparent",
					}}
				>
					Speakify
				</Typography>
				<Typography variant="h6" color="lightgrey" mt={1}>
					Transform your text into natural-sounding speech
				</Typography>
			</Box>

			{/* Main Content */}
			<Paper
				elevation={10}
				className="content-animation"
				sx={{
					borderRadius: 4,
					overflow: "hidden",
					background: "rgba(255, 255, 255, 0.2)",
					backdropFilter: "blur(20px)",
					border: "1px solid rgba(255, 255, 255, 0.3)",
					maxWidth: "1400px",
					width: "90%",
					mx: "auto",
					position: "relative",
					zIndex: 20,
				}}
			>
				<Grid container>
					{/* Left Column */}
					<Grid item xs={12} lg={8} sx={{ p: 4 }}>
						{/* Text Input */}
						<Box className="content-animation">
							<TextField
								id="text"
								label="Text Input"
								multiline
								fullWidth
								inputRef={textAreaRef}
								rows={8}
								variant="outlined"
								placeholder="Enter your text here (max 1000 characters)..."
								value={text}
								onChange={(e) => setText(e.target.value)}
								inputProps={{ maxLength: 1000 }}
								sx={{
									"& .MuiOutlinedInput-root": {
										color: "white",
										"& fieldset": {
											borderColor: "rgba(255, 255, 255, 0.3)",
										},
										"&:hover fieldset": {
											borderColor: "rgba(255, 255, 255, 0.5)",
										},
										"&.Mui-focused fieldset": {
											borderColor: "#9c27b0",
										},
									},
									"& .MuiInputLabel-root": {
										color: "rgba(255, 255, 255, 0.7)",
									},
								}}
							/>
							<Box
								display="flex"
								justifyContent="space-between"
								mt={1}
								color="rgba(255, 255, 255, 0.6)"
							>
								<Typography variant="caption">
									{text.length}/1000 characters
								</Typography>
								<Tooltip title="Clear text">
									<IconButton
										size="small"
										onClick={() => setText("")}
										sx={{ color: "rgba(255, 255, 255, 0.6)" }}
									>
										<HistoryToggleOff fontSize="small" />
									</IconButton>
								</Tooltip>
							</Box>
						</Box>
					</Grid>

					{/* Right Column */}
					<Grid
						item
						xs={12}
						lg={4}
						sx={{
							background: "rgba(0, 0, 0, 0.15)",
							p: 4,
							display: "flex",
							flexDirection: "column",
						}}
					>
						<Box className="content-animation" flex={1}>
							<Button
								fullWidth
								variant="contained"
								disabled={loading || !text}
								onClick={handleGenerateAudio}
								startIcon={
									loading ? (
										<CircularProgress size={20} color="inherit" />
									) : (
										<VolumeUp />
									)
								}
								sx={{
									py: 1.5,
									background: "linear-gradient(45deg, #9c27b0, #673ab7)",
									"&:hover": {
										background: "linear-gradient(45deg, #8e24aa, #5e35b1)",
									},
									"&.Mui-disabled": {
										background: "rgba(255, 255, 255, 0.1)",
										color: "rgba(255, 255, 255, 0.3)",
									},
								}}
							>
								{loading ? "Generating..." : "Generate Audio"}
							</Button>

							{/* Audio Player */}
							<Fade in={!!audioUrl}>
								<Box
									mt={3}
									p={2}
									sx={{
										background: "rgba(255, 255, 255, 0.05)",
										borderRadius: 2,
										border: "1px solid rgba(255, 255, 255, 0.1)",
									}}
									ref={audioControlsRef}
								>
									<Typography variant="subtitle2" color="white" mb={1}>
										Your Audio
									</Typography>
									<Box>
										<audio
											className="w-full"
											controls
											src={audioUrl}
											key={audioUrl}
											style={{ width: "100%" }}
										/>
									</Box>
									{audioUrl && (
										<Box display="flex" justifyContent="flex-end" mt={1}>
											<Tooltip title="Download audio">
												<IconButton
													size="small"
													href={audioUrl}
													download="voicesync-audio.mp3"
													sx={{ color: "rgba(255, 255, 255, 0.7)" }}
												>
													<Download fontSize="small" />
												</IconButton>
											</Tooltip>
										</Box>
									)}
								</Box>
							</Fade>

							{/* Recent Conversions */}
							<Box mt={4} className="content-animation">
								<Typography
									variant="subtitle2"
									color="white"
									sx={{
										display: "flex",
										alignItems: "center",
										mb: 2,
									}}
								>
									<HistoryToggleOff fontSize="small" sx={{ mr: 1 }} />
									Recent Conversions
								</Typography>

								{recentHistory.map((item, index) => (
									<Box
										key={index}
										sx={{
											mb: 1,
											p: 1.5,
											borderRadius: 1,
											background:
												index === 0
													? "rgba(156, 39, 176, 0.15)"
													: "rgba(255, 255, 255, 0.05)",
											border: "1px solid rgba(255, 255, 255, 0.1)",
											fontSize: "0.85rem",
											color: "rgba(255, 255, 255, 0.8)",
										}}
									>
										{item.text}
										<Typography
											variant="caption"
											display="block"
											color="rgba(255, 255, 255, 0.5)"
											mt={0.5}
										>
											{new Date(item.timestamp).toLocaleTimeString()}
										</Typography>
									</Box>
								))}
							</Box>
						</Box>

						{/* Tips Box */}
						<Card
							className="content-animation"
							variant="outlined"
							sx={{
								mt: 4,
								backgroundColor: "rgba(255, 255, 255, 0.03)",
								border: "1px solid rgba(255, 255, 255, 0.1)",
							}}
						>
							<CardContent>
								<Typography
									variant="subtitle2"
									color="white"
									sx={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<Info fontSize="small" sx={{ mr: 1 }} />
									Pro Tips
								</Typography>
								<Divider
									sx={{ my: 1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
								/>
								<Box component="ul" sx={{ pl: 2, mt: 1, mb: 0 }}>
									<Typography
										component="li"
										variant="body2"
										color="rgba(255, 255, 255, 0.7)"
										sx={{ mb: 0.5 }}
									>
										Use punctuation for natural pauses
									</Typography>
									<Typography
										component="li"
										variant="body2"
										color="rgba(255, 255, 255, 0.7)"
										sx={{ mb: 0.5 }}
									>
										Keep sentences clear and concise
									</Typography>
									<Typography
										component="li"
										variant="body2"
										color="rgba(255, 255, 255, 0.7)"
									>
										The tone of text affects the voice outputs
									</Typography>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				</Grid>
			</Paper>
		</Container>
	);
}
