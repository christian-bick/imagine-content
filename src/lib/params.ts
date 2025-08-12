export function getParams(keys: string[]): { [key: string]: string | null } {
    const urlParams = new URLSearchParams(window.location.search);
    const params: { [key: string]: string | null } = {}
    for (const key of keys) {
        params[key] = urlParams.get(key) || null
    }
    return params
}

export function getSortedUrlSearchParams(params: URLSearchParams): string {
    const sortedParams = Array.from(params.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    const newParams = new URLSearchParams();
    for (const [key, value] of sortedParams) {
        newParams.append(key, value);
    }
    return newParams.toString();
}