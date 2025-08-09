export function getParams(keys) {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {}
    for (const key of keys) {
        params[key] = urlParams.get(key) || null
    }
    return params
}