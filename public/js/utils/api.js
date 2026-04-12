const API_BASE_URL = "/api"

async function apiRequest(path, options = {}) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		headers: {
			"Content-Type": "application/json",
			...(options.headers || {}),
		},
		...options,
	})

	const data = await response.json().catch(() => ({}))

	if (!response.ok) {
		const message = data?.message || "Request failed"
		throw new Error(message)
	}

	return data
}

window.Api = {
	apiRequest,
}
