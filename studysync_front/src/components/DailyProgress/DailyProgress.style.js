import { styled } from "@mui/material/styles";

//all the elements in the card
export const ProgressWrapper= styled ("div")({
    display: "flex",
    flexDirection:"column",
    gap:"8px",
});
//"You're getting closer!"
export const Subtitle= styled("div")({
    fontFamily: "Prompt",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    justifyContent: "center",
    color:"#0D3682",
});
//strong purple line
export const ProgressBar= styled("div")({
    position:"relative",
    width:"100%",
    height: "18px",
    background: "#7A6FF0",
    borderRadius:"60px",
    overflow:"hidden",
});
//soft purple line
export const ProgressFill= styled("div")(({ percent})=> ({
    height:"100%",
    width: `${percent}%`,
    background: "rgba(233, 229, 255, 0.80)",
    borderRadius:"60px",
    transition:"width 300ms ease",
    zindex: 1,
}));
//the percents on the soft purple line
export const ProgressLabel= styled("div")(({ percent})=> ({
    position:"absolute",
    top: "50%",
    left: `${percent-1}%`,
    transform: "translate(-100%,-50%)",
    justifyContent: "center",
    color: "#7A6FF0",
    alignItems: "center",
    fontFamily: "Prompt",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "500",
    lineHeight: "normal",
    pointerEvents: "none",
    display:"flex",
    zindex:2,
}));
//strak
export const FooterText= styled("div")({
    color: "#0D3682",
    fontFamily: "Prompt",
    fontSize: "23px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
});





