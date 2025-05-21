import { getToken } from "./token";

export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(`http://localhost:5000/api/${url}`, options);

  if (res.status === 204) return null;

  try {
    //Check if the response is in JSON format
    const data = res.headers.get('content-type')?.includes('application/json')
      ? await res.json() 
      : { message: 'An unexpected error occurred' };

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Failed to parse response as JSON');
  }
};

// Returning the raw response without additional data processing (such as converting to JSON or text).
export const rawFetcher = (url: string, options: RequestInit = {}) => {
  const token = getToken();

  return fetch(`http://localhost:5000/api/${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
};
