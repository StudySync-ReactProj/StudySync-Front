import { StyledTextField } from "./TextFieldComp.style";

const TextFieldComp = ({ inputLabel, inputValue, handleIChange, inputName }) => {
  return (
    <StyledTextField
      variant="filled"
      fullWidth
      label={inputLabel}
      value={inputValue}
      onChange={handleIChange}
      name={inputName}
    />
  );
};

export default TextFieldComp;
