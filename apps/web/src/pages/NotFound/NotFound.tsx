import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
	const navigate = useNavigate();
	return (
		<div className="white">
			<h1>404 - Page Not Found</h1>
			<Button
				variant="contained"
				onClick={() => {
					navigate("/");
				}}
			>
				ホームに戻る
			</Button>
		</div>
	);
};

export default NotFound;
