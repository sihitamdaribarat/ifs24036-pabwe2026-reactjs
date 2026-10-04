import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getUsersApi,
  getUserByIdApi,
  getProfileApi,
  updateProfileApi,
  changePhotoProfileApi,
  changePasswordApi,
} from "./userApi";
import * as apiHelper from "../../../helpers/apiHelper";

vi.mock("../../../helpers/apiHelper", () => ({
  fetchApi: vi.fn(),
}));

describe("userApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call getUsersApi with GET /users", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { users: [] } });
    await getUsersApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users");
  });

  it("should call getUserByIdApi with GET /users/:id", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { user: {} } });
    await getUserByIdApi(5);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/5");
  });

  it("should call getProfileApi with GET /users/me", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { user: {} } });
    await getProfileApi();
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me");
  });

  it("should call updateProfileApi with PUT /users/me", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { user: {} } });
    await updateProfileApi({ name: "Updated Name" });
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "Updated Name" },
    });
  });

  it("should call changePhotoProfileApi with POST /users/me/photo and isFormData", async () => {
    apiHelper.fetchApi.mockResolvedValue({ data: { user: {} } });
    const formData = new FormData();
    await changePhotoProfileApi(formData);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/me/photo", {
      method: "POST",
      body: formData,
      isFormData: true,
    });
  });

  it("should call changePasswordApi with PUT /users/password", async () => {
    apiHelper.fetchApi.mockResolvedValue({ status: "success" });
    const payload = {
      password: "old",
      new_password: "new",
      new_password_confirmation: "new",
    };
    await changePasswordApi(payload);
    expect(apiHelper.fetchApi).toHaveBeenCalledWith("/users/password", {
      method: "PUT",
      body: payload,
    });
  });
});
