(() => {
	if (!window.Auth) {
		window.location.href = "/login"
		return
	}

	const authData = window.Auth.getAuthData()
	if (!authData?.token) {
		const nextPath = encodeURIComponent("/dashboard")
		window.location.href = `/login?next=${nextPath}`
		return
	}

	const logoutButton = document.getElementById("logoutButton")
	if (!logoutButton) {
		return
	}

	logoutButton.addEventListener("click", async () => {
		logoutButton.disabled = true
		logoutButton.textContent = "Logging out..."

		try {
			if (window.Api) {
				await window.Api.apiRequest("/auth/logout", {
					method: "POST",
					headers: {
						Authorization: `Bearer ${authData.token}`,
					},
				})
			}
		} catch (_error) {
			// Client-side logout should still proceed even if the API call fails.
		} finally {
			window.Auth.clearAuthData()
			window.location.href = "/login"
		}
	})
})()
