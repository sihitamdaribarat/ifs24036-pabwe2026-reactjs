import { describe, it, expect } from "vitest";
import lostFoundReducer, {
  setLostFounds,
  setLostFound,
  setIsLostFound,
  setIsLostFoundAdd,
  setIsLostFoundAdded,
  setIsLostFoundChange,
  setIsLostFoundChanged,
  setIsLostFoundChangeCover,
  setIsLostFoundChangedCover,
  setIsLostFoundDelete,
  setIsLostFoundDeleted,
  setLostFoundStats,
  resetLostFoundStatuses,
  asyncGetLostFounds,
  asyncGetLostFoundById,
  asyncAddLostFound,
  asyncUpdateLostFound,
  asyncChangeCoverLostFound,
  asyncDeleteLostFound,
} from "./lostFoundSlice";

describe("lostFoundSlice", () => {
  const initialState = {
    lostFounds: [],
    lostFound: null,
    isLostFound: false,
    isLostFoundAdd: false,
    isLostFoundAdded: false,
    isLostFoundChange: false,
    isLostFoundChanged: false,
    isLostFoundChangeCover: false,
    isLostFoundChangedCover: false,
    isLostFoundDelete: false,
    isLostFoundDeleted: false,
    lostFoundStats: {
      daily: null,
      monthly: null,
    },
    error: null,
  };

  it("should handle initial state", () => {
    expect(lostFoundReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle action setters", () => {
    let state = lostFoundReducer(initialState, setLostFounds([{ id: 1 }]));
    expect(state.lostFounds).toHaveLength(1);

    state = lostFoundReducer(state, setLostFound({ id: 1, title: "Item" }));
    expect(state.lostFound).toEqual({ id: 1, title: "Item" });

    state = lostFoundReducer(state, setIsLostFound(true));
    expect(state.isLostFound).toBe(true);

    state = lostFoundReducer(state, setIsLostFoundAdd(true));
    state = lostFoundReducer(state, setIsLostFoundAdded(true));
    state = lostFoundReducer(state, setIsLostFoundChange(true));
    state = lostFoundReducer(state, setIsLostFoundChanged(true));
    state = lostFoundReducer(state, setIsLostFoundChangeCover(true));
    state = lostFoundReducer(state, setIsLostFoundChangedCover(true));
    state = lostFoundReducer(state, setIsLostFoundDelete(true));
    state = lostFoundReducer(state, setIsLostFoundDeleted(true));
    expect(state.isLostFoundAdd).toBe(true);

    state = lostFoundReducer(state, resetLostFoundStatuses());
    expect(state.isLostFoundAdd).toBe(false);
    expect(state.isLostFoundAdded).toBe(false);
    expect(state.isLostFoundChange).toBe(false);
    expect(state.isLostFoundChanged).toBe(false);
    expect(state.isLostFoundChangeCover).toBe(false);
    expect(state.isLostFoundChangedCover).toBe(false);
    expect(state.isLostFoundDelete).toBe(false);
    expect(state.isLostFoundDeleted).toBe(false);
  });

  it("should handle asyncGetLostFounds fulfilled", () => {
    const list = [{ id: 1, title: "Keys" }];
    const state = lostFoundReducer(initialState, {
      type: asyncGetLostFounds.fulfilled.type,
      payload: list,
    });
    expect(state.lostFounds).toEqual(list);
  });

  it("should handle asyncGetLostFoundById fulfilled", () => {
    const item = { id: 2, title: "Wallet" };
    const state = lostFoundReducer(initialState, {
      type: asyncGetLostFoundById.fulfilled.type,
      payload: item,
    });
    expect(state.lostFound).toEqual(item);
  });

  it("should handle asyncAddLostFound fulfilled", () => {
    const state = lostFoundReducer(initialState, {
      type: asyncAddLostFound.fulfilled.type,
    });
    expect(state.isLostFoundAdded).toBe(true);
  });

  it("should handle asyncUpdateLostFound fulfilled", () => {
    const baseState = {
      ...initialState,
      lostFound: { id: 5, title: "Original" },
    };
    const state = lostFoundReducer(baseState, {
      type: asyncUpdateLostFound.fulfilled.type,
      payload: { id: 5, payload: { title: "Updated" } },
    });
    expect(state.isLostFoundChanged).toBe(true);
    expect(state.lostFound.title).toBe("Updated");
  });

  it("should handle asyncChangeCoverLostFound fulfilled", () => {
    const state = lostFoundReducer(initialState, {
      type: asyncChangeCoverLostFound.fulfilled.type,
    });
    expect(state.isLostFoundChangedCover).toBe(true);
  });

  it("should handle asyncDeleteLostFound fulfilled", () => {
    const baseState = {
      ...initialState,
      lostFounds: [{ id: 1 }, { id: 2 }],
      lostFound: { id: 1 },
    };
    const state = lostFoundReducer(baseState, {
      type: asyncDeleteLostFound.fulfilled.type,
      payload: 1,
    });
    expect(state.isLostFoundDeleted).toBe(true);
    expect(state.lostFounds).toEqual([{ id: 2 }]);
    expect(state.lostFound).toBeNull();
  });
});
