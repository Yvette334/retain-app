const API_URL = import.meta.env.VITE_URL as string

export const TOKEN = "retain";

interface RequestOptions{
    method?: string
    body?: unknown
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const token = localStorage.getItem(TOKEN);

    const headers: Record<string, string> = {"Content-Type": "application/json"}
    if (token) headers.Authorization = `Bearer ${token}`
    const response = await fetch(`${API_URL}${path}`, {
        method: options.method || "GET",
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
    })

    const data = (await response.json()) as T & {message?: string}
    if(!response.ok){
        throw new Error(data.message || "Request failed")
    }

    return data;
}