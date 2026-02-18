const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api/v1';

const normalizeUrl = (path: string) => {
  if (path.startsWith('http')) {
    return path;
  }
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const segment = path.startsWith('/') ? path : `/${path}`;
  return `${base}${segment}`;
};

const buildQuery = (params?: Record<string, string | number | boolean | undefined>) => {
  if (!params) {
    return '';
  }
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === '') {
      return;
    }
    searchParams.append(key, String(value));
  });
  const query = searchParams.toString();
  return query ? `?${query}` : '';
};

const hasFile = (value: unknown): value is File => value instanceof File;

const buildPayload = (data: Record<string, unknown>) => {
  const values = Object.values(data);
  if (values.some(hasFile)) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }
      formData.append(key, value as Blob | string);
    });
    return { body: formData, headers: {} };
  }
  return {
    body: JSON.stringify(data),
    headers: { 'Content-Type': 'application/json' }
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error en la solicitud');
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
};

export const listResource = async (
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>
) => {
  const url = normalizeUrl(`${endpoint}${buildQuery(params)}`);
  const response = await fetch(url);
  return handleResponse(response);
};

export const createResource = async (endpoint: string, data: Record<string, unknown>) => {
  const url = normalizeUrl(endpoint);
  const payload = buildPayload(data);
  const response = await fetch(url, {
    method: 'POST',
    headers: payload.headers,
    body: payload.body
  });
  return handleResponse(response);
};

export const updateResource = async (
  endpoint: string,
  id: string | number,
  data: Record<string, unknown>
) => {
  const url = normalizeUrl(`${endpoint}${id}/`);
  const payload = buildPayload(data);
  const response = await fetch(url, {
    method: 'PUT',
    headers: payload.headers,
    body: payload.body
  });
  return handleResponse(response);
};

export const deleteResource = async (endpoint: string, id: string | number) => {
  const url = normalizeUrl(`${endpoint}${id}/`);
  const response = await fetch(url, { method: 'DELETE' });
  return handleResponse(response);
};
