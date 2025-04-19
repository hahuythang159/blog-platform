export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(`http://localhost:5000/api/${url}`, options);

  if (res.status === 204) return null;

  try {
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw new Error('Failed to parse response as JSON');
  }
};
