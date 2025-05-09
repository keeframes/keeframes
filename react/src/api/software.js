import { API_URL } from "../utils/constants";
import { makeURL } from "../utils/helpers";
import httpClient from "../utils/httpClient";

export async function fetchAllSoftware(type=null) {
  try {
    const url = makeURL(`${API_URL}/softwares`, null, {type: type});
    const response = await httpClient.get(url);
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.error)
  }
}
