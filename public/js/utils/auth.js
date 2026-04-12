const AUTH_STORAGE_KEY = "authData"

function saveAuthData(authPayload, remember = true) {
	const storage = remember ? localStorage : sessionStorage
	const otherStorage = remember ? sessionStorage : localStorage

	otherStorage.removeItem(AUTH_STORAGE_KEY)
	storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload))
}

function getAuthData() {
	const fromLocal = localStorage.getItem(AUTH_STORAGE_KEY)
	const fromSession = sessionStorage.getItem(AUTH_STORAGE_KEY)
	const raw = fromLocal || fromSession

	if (!raw) {
		return null
	}

	try {
		return JSON.parse(raw)
	} catch (_error) {
		localStorage.removeItem(AUTH_STORAGE_KEY)
		sessionStorage.removeItem(AUTH_STORAGE_KEY)
		return null
	}
}

function clearAuthData() {
	localStorage.removeItem(AUTH_STORAGE_KEY)
	sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

window.Auth = {
	saveAuthData,
	getAuthData,
	clearAuthData,
}
