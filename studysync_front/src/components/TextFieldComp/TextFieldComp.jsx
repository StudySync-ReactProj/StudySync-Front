// src/components/TextFieldComp/TextFieldComp.jsx

import { StyledTextField } from "./TextFieldComp.style";

// Reusable styled input component with support for validation messages
const TextFieldComp = ({
  inputLabel,
  inputValue,
  handleIChange,
  inputName,
  type = "text",
  error = false,
  helperText = "",
  placeholder = "",
  multiline = false,
  rows,
  inputProps,
  InputProps,
  onKeyPress,
  sx,
}) => {
  return (
    <StyledTextField
      variant="outlined"
      fullWidth
      label={inputLabel}
      value={inputValue}
      onChange={handleIChange}
      name={inputName}
      type={type}
      error={error}
      helperText={helperText}
      placeholder={placeholder}
      multiline={multiline}
      rows={rows}
      inputProps={inputProps}
      InputProps={InputProps}
      onKeyPress={onKeyPress}
      sx={sx}
    />
  );
};

export default TextFieldComp;
