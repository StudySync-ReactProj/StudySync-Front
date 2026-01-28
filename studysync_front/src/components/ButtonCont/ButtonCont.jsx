// ButtonCont.jsx
import { PrimaryButton } from "./ButtonCont.style";

const ButtonCont = ({ text, onClick, type = "button", disabled = false, variant = "contained", ...props }) => {
  return (
    <PrimaryButton
      onClick={onClick}
      type={type}
      variant={variant}
      disabled={disabled}
      fullWidth
      {...props}
    >
      {text}
    </PrimaryButton>
  );
};

export default ButtonCont;
