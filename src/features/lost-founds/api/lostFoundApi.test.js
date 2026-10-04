import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getLostFoundsApi,
  getLostFoundByIdApi,
  addLostFoundApi,
  updateLostFoundApi,
  changeCoverLostFoundApi,
  deleteLostFoundApi,
  getDailyStatsApi,
  getMonthlyStatsApi,
} from "./lostFoundApi";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("lostFoundApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getLostFoundsApi with params", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { lost_founds: [] } });
    await getLostFoundsApi({ status: "lost", is_completed: 1 });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds", {
      method: "GET",
      params: { status: "lost", is_completed: 1 },
    });
  });

  it("should call getLostFoundByIdApi with id", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { lost_found: {} } });
    await getLostFoundByIdApi(7);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/7", {
      method: "GET",
    });
  });

  it("should call addLostFoundApi with POST", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const payload = { title: "Item", description: "Desc", status: "lost" };
    await addLostFoundApi(payload);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds", {
      method: "POST",
      body: payload,
    });
  });

  it("should call updateLostFoundApi with PUT", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const payload = { title: "Item Updated", is_completed: 1 };
    await updateLostFoundApi(9, payload);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/9", {
      method: "PUT",
      body: payload,
    });
  });

  it("should call changeCoverLostFoundApi with POST and isFormData", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const formData = new FormData();
    await changeCoverLostFoundApi(9, formData);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/9/cover", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  });

  it("should call deleteLostFoundApi with DELETE", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    await deleteLostFoundApi(9);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/9", {
      method: "DELETE",
    });
  });

  it("should call getDailyStatsApi and getMonthlyStatsApi", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: {} });
    await getDailyStatsApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/stats/daily", {
      method: "GET",
      params: {},
    });

    await getMonthlyStatsApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/lost-founds/stats/monthly", {
      method: "GET",
      params: {},
    });
  });
});
