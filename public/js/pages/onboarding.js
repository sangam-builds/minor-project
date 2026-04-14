(() => {
	const form = document.getElementById("onboardingForm")
	const submitButton = document.getElementById("submitButton")
	const messageElement = document.getElementById("formMessage")

	if (!form || !window.Api || !window.Auth) {
		return
	}

	const authData = window.Auth.getAuthData()
	if (!authData?.token) {
		window.location.href = "/login?next=/onboarding"
		return
	}

	if (authData?.user?.onboardingCompleted) {
		window.location.href = "/dashboard"
		return
	}

	function showMessage(text, isSuccess = false) {
		messageElement.textContent = text
		messageElement.classList.toggle("success", isSuccess)
	}

	function getSelectedRadioValue(name) {
		const selected = form.querySelector(`input[name="${name}"]:checked`)
		return selected ? selected.value : ""
	}

	function getSelectedCheckboxValues(name) {
		const selected = form.querySelectorAll(`input[name="${name}"]:checked`)
		return Array.from(selected).map((item) => item.value)
	}

	function buildPayload() {
		return {
			learning_interest: getSelectedCheckboxValues("learning_interest"),
			experience_level: getSelectedRadioValue("experience_level"),
			learning_goal: getSelectedRadioValue("learning_goal"),
			time_commitment: getSelectedRadioValue("time_commitment"),
			learning_style: getSelectedRadioValue("learning_style"),
			prior_experience: getSelectedRadioValue("prior_experience"),
		}
	}

	function validatePayload(payload) {
		if (!Array.isArray(payload.learning_interest) || payload.learning_interest.length === 0) {
			return "Please select at least one learning interest."
		}

		if (!payload.experience_level) {
			return "Please select your experience level."
		}

		if (!payload.learning_goal) {
			return "Please select your learning goal."
		}

		if (!payload.time_commitment) {
			return "Please select your daily time commitment."
		}

		if (!payload.learning_style) {
			return "Please select your learning style."
		}

		return ""
	}

	form.addEventListener("submit", async (event) => {
		event.preventDefault()
		showMessage("")

		const payload = buildPayload()
		const validationError = validatePayload(payload)
		if (validationError) {
			showMessage(validationError)
			return
		}

		submitButton.disabled = true
		submitButton.textContent = "Saving..."

		try {
			const response = await window.Api.apiRequest("/auth/onboarding", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${authData.token}`,
				},
				body: JSON.stringify(payload),
			})

			const updatedUser = response?.data?.user
			if (updatedUser) {
				window.Auth.updateAuthUser(updatedUser)
			}

			showMessage("Great! Your learning profile has been saved.", true)

			setTimeout(() => {
				window.location.href = "/dashboard"
			}, 650)
		} catch (error) {
			showMessage(error.message || "Unable to save onboarding right now. Please try again.")
		} finally {
			submitButton.disabled = false
			submitButton.textContent = "Save & Continue"
		}
	})
})()
