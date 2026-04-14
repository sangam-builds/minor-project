const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const onboardingOptions = {
	learning_interest: [
		"Web Development",
		"Machine Learning",
		"App Development",
		"Data Science",
		"Cybersecurity",
		"Other",
	],
	experience_level: ["Beginner", "Intermediate", "Advanced"],
	learning_goal: ["Get a job", "Build projects", "Freelancing", "Just exploring"],
	time_commitment: ["30 mins", "1 hour", "2+ hours", "Weekends only"],
	learning_style: ["Videos", "Reading", "Projects", "Mixed"],
	prior_experience: ["No experience", "Basic knowledge", "Built projects"],
}

const validateRegister = (body) => {
	const errors = []
	const { name, email, password } = body

	if (!name || typeof name !== "string" || name.trim().length < 2) {
		errors.push("Name must be at least 2 characters")
	}

	if (!email || typeof email !== "string" || !emailRegex.test(email)) {
		errors.push("Valid email is required")
	}

	if (!password || typeof password !== "string" || password.length < 6) {
		errors.push("Password must be at least 6 characters")
	}

	return errors
}

const validateLogin = (body) => {
	const errors = []
	const { email, password } = body

	if (!email || typeof email !== "string" || !emailRegex.test(email)) {
		errors.push("Valid email is required")
	}

	if (!password || typeof password !== "string") {
		errors.push("Password is required")
	}

	return errors
}

const validateOnboarding = (body = {}) => {
	const errors = []
	const {
		learning_interest,
		experience_level,
		learning_goal,
		time_commitment,
		learning_style,
		prior_experience,
	} = body

	if (!Array.isArray(learning_interest) || learning_interest.length === 0) {
		errors.push("learning_interest must include at least one selection")
	} else {
		const hasInvalidInterest = learning_interest.some(
			(item) => typeof item !== "string" || !onboardingOptions.learning_interest.includes(item)
		)

		if (hasInvalidInterest) {
			errors.push("learning_interest contains invalid options")
		}
	}

	if (
		typeof experience_level !== "string" ||
		!onboardingOptions.experience_level.includes(experience_level)
	) {
		errors.push("experience_level is invalid")
	}

	if (
		typeof learning_goal !== "string" ||
		!onboardingOptions.learning_goal.includes(learning_goal)
	) {
		errors.push("learning_goal is invalid")
	}

	if (
		typeof time_commitment !== "string" ||
		!onboardingOptions.time_commitment.includes(time_commitment)
	) {
		errors.push("time_commitment is invalid")
	}

	if (
		typeof learning_style !== "string" ||
		!onboardingOptions.learning_style.includes(learning_style)
	) {
		errors.push("learning_style is invalid")
	}

	if (
		prior_experience !== undefined &&
		prior_experience !== null &&
		prior_experience !== "" &&
		(typeof prior_experience !== "string" ||
			!onboardingOptions.prior_experience.includes(prior_experience))
	) {
		errors.push("prior_experience is invalid")
	}

	return errors
}

module.exports = {
	validateRegister,
	validateLogin,
	validateOnboarding,
}
