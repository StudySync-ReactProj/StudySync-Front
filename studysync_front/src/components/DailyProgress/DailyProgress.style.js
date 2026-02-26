import { styled } from "@mui/material/styles";

//all the elements in the card
export const ProgressWrapper = styled("div")({
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    marginTop: "-10px",
});
//"You're getting closer!"
export const Subtitle = styled("div")(({ theme }) => ({
    fontFamily: "Prompt",
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    justifyContent: "center",
    color: theme.palette.text.primary,
}));
//outside purple line
export const ProgressBar = styled("div")({
    position: "relative",
    width: "100%",
    height: "18px",
    background: "rgba(233, 229, 255, 0.80)",
    borderRadius: "60px",
    overflow: "hidden",
});
//inside purple line
export const ProgressFill = styled("div")(({ percent }) => ({
    position: "relative",
    height: "100%",
    width: `${percent}%`,
    background: "#7A6FF0",
    borderRadius: "60px",
    transition: "width 800ms ease",
    overflow: "visible",
    minWidth: percent === 0 ? "0px" : "44px",
}));
//the percents on the inside purple line
export const ProgressLabel = styled("span")({
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#7A6FF0",
    fontFamily: "Prompt",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    pointerEvents: "none",
});
//streak
export const FooterText = styled("div")(({ theme }) => ({
    color: theme.palette.text.primary,
    fontFamily: "Prompt",
    fontSize: "23px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    marginButtom: "5px",
    marginTop: "5px",
}));





