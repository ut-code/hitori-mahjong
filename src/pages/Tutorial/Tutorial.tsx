import { useNavigate } from "react-router-dom";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import BasicRules from "./BasicRules";
import LocalRules from "./LocalRules";
import { useState } from "react";
import { Button } from "@mui/material";
import styles from "../../styles/Tutorial.module.css";

type ContentsType = "basic" | "local";

export default function Tutorial() {
	const [currentContent, setCurrentContent] = useState<ContentsType>("basic");
	const navigate = useNavigate();
	const contents: ContentsType[] = ["basic", "local"];

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<IconButton
					onClick={() => {
						navigate("/");
					}}
				>
					<HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
				</IconButton>
				<h2 className={styles.headerTitle}>遊び方</h2>
			</div>

			<div className={styles.body}>
				<div className={styles.drawer}>
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

				<div className={styles.contents}>
					{currentContent === "basic" && <BasicRules />}
					{currentContent === "local" && <LocalRules />}
				</div>
			</div>
		</div>
	);
}
