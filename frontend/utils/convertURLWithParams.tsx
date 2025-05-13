export function convertURLWithParams(
  baseUrl: string,
  params?: Record<string, string | number | boolean | undefined | null | object | Array<string> | Array<number>>
): string {
  const query = new URLSearchParams();

  if (params && typeof params === 'object') {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            query.append(key, String(item));
          });
        }
        else {
          query.append(key, String(value));
        }
      }
    });
  }

  const queryString = query.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
