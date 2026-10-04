import { fetchApi } from "../../../helpers/apiHelper";

/**
 * Perform login request
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<any>}
 */
export async function loginApi({ email, password }) {
  return await fetchApi("/auth/login", {
    method: "POST",
    body: { email, password },
  });
}

/**
 * Perform user registration request
 * @param {{ name: string, email: string, password: string }} payload
 * @returns {Promise<any>}
 */
export async function registerApi({ name, email, password }) {
  return await fetchApi("/auth/register", {
    method: "POST",
    body: { name, email, password },
  });
}

/**
 * Perform logout request
 * @returns {Promise<any>}
 */
export async function logoutApi() {
  return await fetchApi("/auth/logout", {
    method: "POST",
  });
}
