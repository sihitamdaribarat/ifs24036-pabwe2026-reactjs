import { fetchApi } from "../../../helpers/apiHelper";

/**
 * Fetch all lost & found items with query filters
 * @param {{ status?: 'lost'|'found', is_completed?: 0|1|string|number, is_me?: 1|string|number }} [params]
 * @returns {Promise<any>}
 */
export async function getLostFoundsApi(params = {}) {
  return await fetchApi("/lost-founds", {
    method: "GET",
    params,
  });
}

/**
 * Fetch single lost & found detail by ID
 * @param {string|number} id
 * @returns {Promise<any>}
 */
export async function getLostFoundByIdApi(id) {
  return await fetchApi(`/lost-founds/${id}`, {
    method: "GET",
  });
}

/**
 * Create new lost & found report
 * @param {{ title: string, description: string, status: 'lost'|'found' }} payload
 * @returns {Promise<any>}
 */
export async function addLostFoundApi(payload) {
  return await fetchApi("/lost-founds", {
    method: "POST",
    body: payload,
  });
}

/**
 * Update existing lost & found report
 * @param {string|number} id
 * @param {{ title?: string, description?: string, status?: 'lost'|'found', is_completed?: 0|1|number }} payload
 * @returns {Promise<any>}
 */
export async function updateLostFoundApi(id, payload) {
  return await fetchApi(`/lost-founds/${id}`, {
    method: "PUT",
    body: payload,
  });
}

/**
 * Upload or replace cover image for a lost & found report
 * @param {string|number} id
 * @param {FormData} formData - FormData with 'cover' file
 * @returns {Promise<any>}
 */
export async function changeCoverLostFoundApi(id, formData) {
  return await fetchApi(`/lost-founds/${id}/cover`, {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

/**
 * Delete a lost & found report
 * @param {string|number} id
 * @returns {Promise<any>}
 */
export async function deleteLostFoundApi(id) {
  return await fetchApi(`/lost-founds/${id}`, {
    method: "DELETE",
  });
}

/**
 * Fetch daily statistics
 * @param {Record<string, any>} [params]
 * @returns {Promise<any>}
 */
export async function getDailyStatsApi(params = {}) {
  return await fetchApi("/lost-founds/stats/daily", {
    method: "GET",
    params,
  });
}

/**
 * Fetch monthly statistics
 * @param {Record<string, any>} [params]
 * @returns {Promise<any>}
 */
export async function getMonthlyStatsApi(params = {}) {
  return await fetchApi("/lost-founds/stats/monthly", {
    method: "GET",
    params,
  });
}
