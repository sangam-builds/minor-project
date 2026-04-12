let googleScriptPromise = null
let googleClientIdPromise = null

const loadGoogleScript = () => {
	if (!googleScriptPromise) {
		googleScriptPromise = new Promise((resolve, reject) => {
			if (window.google?.accounts?.oauth2) {
				resolve()
				return
			}

			const script = document.createElement("script")
			script.src = "https://accounts.google.com/gsi/client"
			script.async = true
			script.defer = true
			script.onload = () => resolve()
			script.onerror = () => reject(new Error("Failed to load Google authentication script"))
			document.head.appendChild(script)
		})
	}

	return googleScriptPromise
}

const getGoogleClientId = async () => {
	if (!googleClientIdPromise) {
		googleClientIdPromise = window.Api.apiRequest("/auth/google/config")
			.then((response) => response?.data?.clientId)
			.then((clientId) => {
				if (!clientId) {
					throw new Error("Google login is not configured on this server")
				}

				return clientId
			})
	}

	return googleClientIdPromise
}

const requestGoogleAccessToken = async (clientId) => {
	await loadGoogleScript()

	return new Promise((resolve, reject) => {
		const tokenClient = window.google.accounts.oauth2.initTokenClient({
			client_id: clientId,
			scope: "openid email profile",
			callback: (response) => {
				if (!response || response.error || !response.access_token) {
					reject(new Error("Google authentication failed"))
					return
				}

				resolve(response.access_token)
			},
		})

		tokenClient.requestAccessToken({ prompt: "consent" })
	})
}

const authenticateWithGoogle = async () => {
	if (!window.Api) {
		throw new Error("API utility is not available")
	}

	const clientId = await getGoogleClientId()
	const accessToken = await requestGoogleAccessToken(clientId)

	const response = await window.Api.apiRequest("/auth/google", {
		method: "POST",
		body: JSON.stringify({ accessToken }),
	})

	const authData = {
		token: response?.data?.token,
		user: response?.data?.user,
	}

	if (!authData.token) {
		throw new Error("Google login succeeded but no token was returned")
	}

	return authData
}

window.GoogleAuth = {
	authenticateWithGoogle,
}
