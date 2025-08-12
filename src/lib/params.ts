export function getParams(keys: string[]): { [key: string]: string | null } {
    const urlParams = new URLSearchParams(window.location.search);
    const params: { [key: string]: string | null } = {}
    for (const key of keys) {
        params[key] = urlParams.get(key) || null
    }
    return params
}