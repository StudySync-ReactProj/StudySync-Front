import { styled } from "@mui/material/styles";

//all the elements in the card
export const ProgressWrapper= styled ("div")({
    display: "flex",
    flexDirection:"column",
    gap:"8px",
});
//"You're getting closer!"
export const Subtitle= styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    fontFamily: "Prompt",
    fontSize: "22px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
    justifyContent: "center",
    color: themeMode === 'dark' ? '#ffffff' : '#061738',
}));
//strong purple line
export const ProgressBar= styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    position:"relative",
    width:"100%",
    height: "18px",
    background: themeMode === 'dark' ? '#9f93ff' : '#7A6FF0',
    borderRadius:"60px",
    overflow:"hidden",
}));
//soft purple line
export const ProgressFill= styled("div", {
    shouldForwardProp: (prop) => prop !== "percent" && prop !== "themeMode",
})(({ percent, themeMode })=> ({
   position: "relative",        
  height: "100%",
  width: `${percent}%`,
  background: themeMode === 'dark' ? 'rgba(159, 147, 255, 0.3)' : 'rgba(233, 229, 255, 0.80)',
  borderRadius: "60px",
  transition: "width 800ms ease",
  overflow: "visible",  
  minWidth: percent === 0 ? "0px" : "44px", 
}));
//the percents on the soft purple line
export const ProgressLabel= styled("span", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    position: "absolute",
    right: "10px",               
    top: "50%",
    transform: "translateY(-50%)",
    color: themeMode === 'dark' ? '#9f93ff' : '#7A6FF0',
    fontFamily: "Prompt",
    fontSize: "14px",
    fontWeight: "600",
    whiteSpace: "nowrap",
    pointerEvents: "none",
}));
//streak
export const FooterText= styled("div", {
    shouldForwardProp: (prop) => prop !== "themeMode",
})(({ themeMode }) => ({
    color: themeMode === 'dark' ? '#ffffff' : '#061738',
    fontFamily: "Prompt",
    fontSize: "23px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "normal",
}));





