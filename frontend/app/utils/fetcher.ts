export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(`http://localhost:5000/api/${url}`, options);

  if (res.status === 204) return null;

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  
  return data;
};
