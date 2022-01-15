import { TextFieldProps, TextField } from '@material-ui/core';
import React from 'react';

export type FormTextFieldProps = TextFieldProps;

const FormTextField: React.FC<FormTextFieldProps> = ({
  InputLabelProps,
  placeholder,
  label,
  fullWidth,
  ...textFieldProps
}) => {
  const _InputLabelProps = InputLabelProps ? { shrink: true, ...InputLabelProps } : { shrink: true };

  return (
    <TextField
      fullWidth={fullWidth || true}
      variant="outlined"
      margin="dense"
      {...textFieldProps}
      InputLabelProps={_InputLabelProps}
      label={label || placeholder}
      placeholder={placeholder}
    />
  );
};

export default FormTextField;
