import { useState, useCallback } from "react";

/**
 * Custom hook for reusable two-way data binding on form inputs
 * @param {any} [initialValue=""] - Default initial state value
 * @returns {[any, (e: any) => void, (val: any) => void]}
 */
export function useInput(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((event) => {
    if (event && event.target !== undefined) {
      const target = event.target;
      if (target.type === "checkbox") {
        setValue(target.checked);
      } else {
        setValue(target.value);
      }
    } else {
      setValue(event);
    }
  }, []);

  return [value, onChange, setValue];
}

export default useInput;
