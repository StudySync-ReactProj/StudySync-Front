// ButtonCont.jsx
import { PrimaryButton } from "./ButtonCont.style";

const ButtonCont = ({ text, onClick, type = "button" }) => {
  return (
    <PrimaryButton
      onClick={onClick}
      type={type}
      variant="contained"
      fullWidth
    >
      {text}
    </PrimaryButton>
  );
};

export default ButtonCont;
