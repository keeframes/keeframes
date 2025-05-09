import httpClient from "./httpClient";
import { CDN_URL } from "./constants";

// grabs the first file from a list of files
export const getFile = (files, filetypes) => {
  if (files && files.length > 0) {
    for (let index in files) {
      let file = files.item(index);
      if (filetypes.includes(file.type)) {
        // makes a url to the file
        file.url = URL.createObjectURL(file);
        return file;
      }
    }
  }
};


export function makeURL(baseUrl, routeParam = null, queryParams = {}) {
  let url = baseUrl;

  // if route param then encode it and append it
  // eg. "url/test route" -> "url/test%20route"
  if (routeParam) {
    url += `/${encodeURIComponent(routeParam)}`;
  }

  // remove null or undefined query parameters
  const cleanedParams = Object.fromEntries(
    Object.entries(queryParams).filter(([_, v]) => v != null)
  );

  const queryString = new URLSearchParams(cleanedParams).toString();

  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}


// Function to populate FormData with INITIAL_DATA
export const populateFormData = (data) => {
  const form = new FormData()
  for (let key in data) {
    // Skip the key if it's undefined or null
    if (data[key] !== null && data[key] !== undefined) {
      // If the key represents a file (like profile picture), append it as a file
      if (key === "pfp" && data[key] instanceof File) {
        form.append(key, data[key]);
      } else {
        form.append(key, data[key]);
      }
    }
  }
  return form;
};

