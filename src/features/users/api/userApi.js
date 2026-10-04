import { fetchApi } from "../../../helpers/apiHelper";

/**
 * Fetch all users
 * @returns {Promise<any>}
 */
export async function getUsersApi() {
  return await fetchApi("/users");
}

/**
 * Fetch user by ID
 * @param {string|number} id
 * @returns {Promise<any>}
 */
export async function getUserByIdApi(id) {
  return await fetchApi(`/users/${id}`);
}

/**
 * Fetch current user profile
 * @returns {Promise<any>}
 */
export async function getProfileApi() {
  return await fetchApi("/users/me");
}

/**
 * Update current user profile info
 * @param {{ name: string, email?: string }} payload
 * @returns {Promise<any>}
 */
export async function updateProfileApi(payload) {
  return await fetchApi("/users/me", {
    method: "PUT",
    body: payload,
  });
}

/**
 * Upload avatar photo
 * @param {FormData} formData - FormData containing 'photo' file
 * @returns {Promise<any>}
 */
export async function changePhotoProfileApi(formData) {
  return await fetchApi("/users/me/photo", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

/**
 * Change password
 * @param {{ password: string, new_password: string, new_password_confirmation: string }} payload
 * @returns {Promise<any>}
 */
export async function changePasswordApi(payload) {
  try {
    return await fetchApi("/users/password", {
      method: "PUT",
      body: payload,
    });
  } catch (error) {
    // If /users/password returns 404, fallback to /users/me/password
    if (error.status === 404) {
      return await fetchApi("/users/me/password", {
        method: "PUT",
        body: payload,
      });
    }
    throw error;
  }
}
