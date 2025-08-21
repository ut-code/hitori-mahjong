import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BasicRules from "./BasicRules";
import LocalRules from "./LocalRules";

type ContentsType = "basic" | "local";

export default function Tutorial() {
	const [currentContent, setCurrentContent] = useState<ContentsType>("basic");
	const navigate = useNavigate();
	const contents: ContentsType[] = ["basic", "local"];

	return (
		<div className="flex flex-col items-center bg-white rounded-[1rem] absolute h-[80vh] w-[80vw] left-[10%] top-[10%] pt-4 pl-4">
			<div className="flex items-center w-full h-[10%]">
				<IconButton
					onClick={() => {
						navigate("/");
					}}
				>
					<HighlightOffIcon style={{ color: "#2B2B2B", fontSize: "2rem" }} />
				</IconButton>
				<div className="absolute left-1/2 -translate-x-1/2 font-bold text-3xl">
					一人麻雀 チュートリアル
				</div>
			</div>

			<div className="grid size-full gap-[3%] h-[90%] overflow-auto pt-4">
				<div className="col-start-1 col-end-2 flex w-50 flex-col border-r border-gray-300 px-5 h-full">
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

				<div className="col-start-2 col-end-3 text-left">
					{currentContent === "basic" && <BasicRules />}
					{currentContent === "local" && <LocalRules />}
				</div>
			</div>
		</div>
	);
}
