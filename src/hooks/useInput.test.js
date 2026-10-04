import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

describe("useInput hook", () => {
  it("should initialize with given default value", () => {
    const { result } = renderHook(() => useInput("initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("should update value from event target value", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current[1]({ target: { value: "new input" } });
    });

    expect(result.current[0]).toBe("new input");
  });

  it("should update checkbox target checked", () => {
    const { result } = renderHook(() => useInput(false));

    act(() => {
      result.current[1]({ target: { type: "checkbox", checked: true } });
    });

    expect(result.current[0]).toBe(true);
  });

  it("should allow setting value directly via setter", () => {
    const { result } = renderHook(() => useInput(""));

    act(() => {
      result.current[2]("direct value");
    });

    expect(result.current[0]).toBe("direct value");
  });
});
