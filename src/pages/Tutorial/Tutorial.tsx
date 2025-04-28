import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BasicRules from "./BasicRules";
import LocalRules from "./LocalRules";
import { useState, CSSProperties } from "react";
import { Button } from "@mui/material";

type ContentsType = "basic" | "local";

export default function Tutorial() {
	const [currentContent, setCurrentContent] = useState<ContentsType>("basic");
	const navigate = useNavigate();

	const containerStyle: CSSProperties = {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		fontFamily: "'Arial', sans-serif",
		gap: "16px",
		color: "#2B2B2B",
		backgroundColor: "white",
		borderRadius: "1%",
		position: "fixed",
		left: "10%",
		top: "10%",
		width: "80%",
		height: "80%",
		maxHeight: "calc(100vh - 100px)",
		overflowY: "auto",
	};

	const headerStyle: CSSProperties = {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		position: "relative",
	};

	const headerTitleStyle: CSSProperties = {
		position: "absolute",
		left: "50%",
		transform: "translateX(-50%)",
	};

	const bodyStyle: CSSProperties = {
		display: "grid",
		gridTemplateColumns: "230px 1fr",
		width: "100%",
		height: "100%",
		gap: "3%",
	};

	const drawerStyle: CSSProperties = {
		gridColumn: "1/2",
		display: "flex",
		flexDirection: "column",
		borderRight: "2px solid #ccc",
		paddingLeft: "5%",
		paddingRight: "5%",
		height: "100%",
	};

	const contentsStyle: CSSProperties = {
		gridColumn: "2/3",
		textAlign: "left",
	};

	const contents: ContentsType[] = ["basic", "local"];

	return (
		<div style={containerStyle}>
			<div style={headerStyle}>
				<IconButton
					onClick={() => {
						navigate("/");
					}}
				>
					<HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
				</IconButton>
				<h2 style={headerTitleStyle}>遊び方</h2>
			</div>

			<div style={bodyStyle}>
				<div style={drawerStyle}>
					{contents.map((content) => (
						<Button
							key={content}
							sx={{
								marginBottom: "10%",
							}}
							variant={currentContent === content ? "contained" : "outlined"}
							onClick={() => setCurrentContent(content)}
						>
							{content === "basic" ? "基本ルール" : "ローカルルール"}
						</Button>
					))}
				</div>

				<div style={contentsStyle}>
					{currentContent === "basic" && <BasicRules />}
					{currentContent === "local" && <LocalRules />}
				</div>
			</div>
		</div>
	);
}
