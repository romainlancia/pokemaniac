import React, { useState, useEffect } from 'react';

const DebouncedInput = ({
  label,
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  label: string;
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, debounce, onChange]);

  return (
    <>
      <label className="mr-3">{label}:</label>
      <input
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
};

export default DebouncedInput;
