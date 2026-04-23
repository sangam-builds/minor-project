const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const onboardingOptions = {
	main_goal: [
		"Crack placement interviews and get a job",
		"Build real projects and apps",
		"Get better at competitive programming",
		"Learn programming from scratch",
		"Just exploring and curious",
	],
	background: [
		"Never written code",
		"Know the basics",
		"Built small projects",
		"Comfortable coding",
		"Working or internship",
	],
	languages: ["C or C++", "Java", "Python", "JavaScript", "None yet"],
	track_preference: [
		"DSA and interviews",
		"Backend development",
		"Not sure yet",
	],
	time_commitment: [
		"Less than 2 hours",
		"2 to 5 hours",
		"5 to 10 hours",
		"More than 10 hours",
	],
	biggest_challenge: [
		"Didn't know where to start",
		"Lost motivation halfway",
		"Content too easy",
		"Content too fast",
		"No progress tracking",
	],
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
		main_goal,
		background,
		languages,
		track_preference,
		time_commitment,
		biggest_challenge,
	} = body

	if (
		typeof main_goal !== "string" ||
		!onboardingOptions.main_goal.includes(main_goal)
	) {
		errors.push("main_goal is invalid")
	}

	if (
		typeof background !== "string" ||
		!onboardingOptions.background.includes(background)
	) {
		errors.push("background is invalid")
	}

	if (!Array.isArray(languages) || languages.length === 0) {
		errors.push("languages must include at least one selection")
	} else {
		const hasInvalidLanguage = languages.some(
			(item) => typeof item !== "string" || !onboardingOptions.languages.includes(item)
		)

		if (hasInvalidLanguage) {
			errors.push("languages contains invalid options")
		}
	}

	if (
		typeof track_preference !== "string" ||
		!onboardingOptions.track_preference.includes(track_preference)
	) {
		errors.push("track_preference is invalid")
	}

	if (
		typeof time_commitment !== "string" ||
		!onboardingOptions.time_commitment.includes(time_commitment)
	) {
		errors.push("time_commitment is invalid")
	}

	if (
		typeof biggest_challenge !== "string" ||
		!onboardingOptions.biggest_challenge.includes(biggest_challenge)
	) {
		errors.push("biggest_challenge is invalid")
	}

	return errors
}

module.exports = {
	validateRegister,
	validateLogin,
	validateOnboarding,
}
