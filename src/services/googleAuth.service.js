const getGoogleUserFromAccessToken = async (accessToken) => {
	if (!process.env.GOOGLE_CLIENT_ID) {
		throw new Error("Google authentication is not configured")
	}

	const tokenInfoResponse = await fetch(
		`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accessToken)}`
	)
	const tokenInfo = await tokenInfoResponse.json().catch(() => ({}))

	if (!tokenInfoResponse.ok) {
		throw new Error("Unable to verify Google account")
	}

	if (tokenInfo.aud !== process.env.GOOGLE_CLIENT_ID) {
		throw new Error("Google account is not authorized for this application")
	}

	const profileResponse = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	const profile = await profileResponse.json().catch(() => ({}))

	if (!profileResponse.ok) {
		throw new Error("Unable to verify Google account")
	}

	if (!profile?.email) {
		throw new Error("Google account email is unavailable")
	}

	if (profile.email_verified === false || tokenInfo.email_verified === "false") {
		throw new Error("Google account email is not verified")
	}

	return {
		...profile,
		googleId: profile.sub || tokenInfo.sub,
	}
}

module.exports = {
	getGoogleUserFromAccessToken,
}
