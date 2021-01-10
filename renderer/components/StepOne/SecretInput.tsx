import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import React, { useRef } from "react";

interface SecretInputI {
  id: string;
  label: string;
  showValue: boolean;
  toggleShowValue: () => void;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const SecretInput: React.FC<SecretInputI> = ({
  id,
  label,
  showValue,
  toggleShowValue,
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <FormControl variant="outlined">
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <OutlinedInput
        inputRef={inputRef}
        id={id}
        type={showValue ? "text" : "password"}
        value={value}
        onChange={onChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              tabIndex="-1"
              onClick={() => {
                toggleShowValue();
                inputRef.current.focus();
                //https://bugs.chromium.org/p/chromium/issues/detail?id=32865
                setTimeout(() => {
                  inputRef.current.setSelectionRange(
                    value.length,
                    value.length
                  );
                });
              }}
              edge="end"
            >
              {showValue ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        }
        label={label}
      />
    </FormControl>
  );
};

export default SecretInput;
