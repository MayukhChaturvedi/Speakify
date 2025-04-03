import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./fonts.css";
import { AuthProvider } from "react-oidc-context";
import { SnackbarProvider } from "notistack";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

// Create custom Material UI theme
const theme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#9c27b0",
			light: "#ba68c8",
			dark: "#7b1fa2",
		},
		secondary: {
			main: "#673ab7",
			light: "#9575cd",
			dark: "#512da8",
		},
		background: {
			default: "#121212",
			paper: "#1e1e2f",
		},
		text: {
			primary: "#ffffff",
			secondary: "rgba(255, 255, 255, 0.7)",
		},
	},
	typography: {
		fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
		h1: {
			fontWeight: 700,
		},
		h2: {
			fontWeight: 700,
		},
		h3: {
			fontWeight: 600,
		},
		button: {
			fontWeight: 600,
			textTransform: "none",
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: 8,
					boxShadow: "0 4px 14px 0 rgba(0, 0, 0, 0.3)",
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: {
					backgroundImage: "none",
				},
			},
		},
		MuiContainer: {
			styleOverrides: {
				root: {
					paddingLeft: 0,
					paddingRight: 0,
					maxWidth: "100%", // Override default max width
				},
			},
		},
	},
});

const cognitoAuthConfig = {
	authority: import.meta.env.VITE_AUTHORITY,
	client_id: import.meta.env.VITE_CLIENT_ID,
	redirect_uri: import.meta.env.VITE_REDIRECT_URI,
	// redirect_uri: "http://localhost:5173",
	response_type: "code",
	scope: "email openid phone",
};

createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<SnackbarProvider
				maxSnack={3}
				anchorOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				autoHideDuration={3000}
				preventDuplicate
			>
				<AuthProvider {...cognitoAuthConfig}>
					<App />
				</AuthProvider>
			</SnackbarProvider>
		</ThemeProvider>
	</StrictMode>
);
