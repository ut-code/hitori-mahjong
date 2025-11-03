import { darken } from "@mui/material/styles";

export const top1Color = "#DBC27E";
export const top2Color = "#CDCDCD";
export const top3Color = "#DABEB3";

export const containerStyle: { [key: string]: string } = {
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	minWidth: "400px",
	maxHeight: "800px",
	gap: "16px",
	color: "#2B2B2B",
	backgroundColor: "white",
	borderRadius: "10px",
};

export const headerStyle: { [key: string]: string } = {
	display: "flex",
	justifyContent: "space-between",
	alignItems: "center",
	width: "100%",
	position: "relative",
	paddingBottom: "24px",
};

export const headerTitleStyle: { [key: string]: string } = {
	position: "absolute",
	left: "50%",
	transform: "translateX(-50%)",
	fontSize: "30px",
	fontWeight: "bold",
};

export const topRankingStyle: { [key: string]: string } = {
	display: "flex",
	justifyContent: "center",
	gap: "16px",
	width: "100%",
	alignItems: "flex-end",
};

export const topRankItemStyle = (
	backgroundColor: string,
): { [key: string]: string } => ({
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	justifyContent: "flex-end",
	paddingBottom: "8px",
	backgroundColor: "white",
	borderRadius: "10px",
	fontWeight: "bold",
	color: "#2B2B2B",
	boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
	borderTop: `5px solid ${backgroundColor}`,
	position: "relative",
	width: "200px",
	height: "110px",
});

export const topRankNumberStyle = (
	backgroundColor: string,
): { [key: string]: string } => ({
	fontSize: "1.6rem",
	position: "absolute",
	top: "-25px",
	width: "40px",
	height: "40px",
	color: "white",
	background: `linear-gradient(to bottom right, ${backgroundColor}, ${darken(backgroundColor, 0.2)})`,
	borderRadius: "10px",
});

export const crownIconStyle = (
	backgroundColor: string,
): { [key: string]: string } => ({
	position: "absolute",
	top: "-48px",
	left: "50%",
	transform: "translateX(-50%)",
	fontSize: "1.3rem",
	color: backgroundColor,
});

export const topRankScoreStyle: { [key: string]: string } = {
	fontSize: "2rem",
};

export const topRankUsernameStyle: { [key: string]: string } = {
	fontSize: "1rem",
};
