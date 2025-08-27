import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import IconButton from "@mui/material/IconButton";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";

type ContentIdType = "basic" | "local";

export default function Tutorial() {
	const navigate = useNavigate();
	const { contentId } = useParams<{ contentId: ContentIdType }>();
	const contents: ContentIdType[] = ["basic", "local"];

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
						<Link
							key={content}
							to={`/tutorial/${content}`}
							className={`
		mb-[10%] px-4 py-2 rounded border transition-colors duration-200
		${
			contentId === content
				? "bg-blue-500 text-white border-blue-500"
				: "bg-transparent text-blue-500 border-blue-500 hover:bg-blue-50"
		}
	`}
						>
							{content === "basic" ? "基本ルール" : "ローカルルール"}
						</Link>
					))}
				</div>

				<div className="col-start-2 col-end-3 text-left">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
