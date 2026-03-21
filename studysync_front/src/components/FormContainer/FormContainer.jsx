import { useTheme } from "@mui/material/styles";
import {
  ContainerWrapper,
  FormCard,
  LogoImage,
  Subtitle,
} from "./FormContainer.style";
import darkLogo from "../../assets/dark.svg";
import whiteLogo from "../../assets/white.png";

const FormContainer = ({ title, subtitle, children }) => {
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const logo = isDarkMode ? whiteLogo : darkLogo;

  return (
    <ContainerWrapper>
      <FormCard elevation={4}>
        {title && <LogoImage src={logo} alt="StudySync Logo" />}
        {subtitle && <Subtitle variant="h6">{subtitle}</Subtitle>}
        {children}
      </FormCard>
    </ContainerWrapper>
  );
};

export default FormContainer;
