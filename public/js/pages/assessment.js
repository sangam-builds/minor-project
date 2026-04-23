(() => {
	const POLL_INTERVAL_MS = 5000
	const QUIZ_START_DELAY_SECONDS = 30
	let pollHandle = null
	let countdownHandle = null
	let countdownTarget = null
	let startButtonDefaultLabel = "Start Level Check"

	const elements = {
		livePill: document.getElementById("livePill"),
		currentLevel: document.getElementById("currentLevel"),
		latestMeta: document.getElementById("latestMeta"),
		latestScore: document.getElementById("latestScore"),
		bestScore: document.getElementById("bestScore"),
		attemptCount: document.getElementById("attemptCount"),
		trackPreference: document.getElementById("trackPreference"),
		latestAttemptBlock: document.getElementById("latestAttemptBlock"),
		historyList: document.getElementById("historyList"),
		startAssessmentBtn: document.getElementById("startAssessmentBtn"),
		goDashboardBtn: document.getElementById("goDashboardBtn"),
		countdownOverlay: document.getElementById("countdownOverlay"),
		countdownRing: document.getElementById("countdownRing"),
		countdownTime: document.getElementById("countdownTime"),
		cancelCountdownBtn: document.getElementById("cancelCountdownBtn"),
	}

	const capitalize = (value) => {
		if (!value) {
			return "Not available"
		}

		return value.charAt(0).toUpperCase() + value.slice(1)
	}

	const formatDateTime = (value) => {
		if (!value) {
			return "Unknown"
		}

		const date = new Date(value)
		return date.toLocaleString("en-US", {
			month: "short",
			day: "numeric",
			hour: "numeric",
			minute: "2-digit",
		})
	}

	const renderLatestAttempt = (latest) => {
		if (!latest) {
			elements.latestAttemptBlock.innerHTML =
				'<p class="panel-note">No assessment attempts yet. Start your first level check.</p>'
			return
		}

		elements.latestAttemptBlock.innerHTML = `
			<p class="attempt-line"><strong>Score:</strong> ${latest.score}%</p>
			<p class="attempt-line"><strong>Correct:</strong> ${latest.correctAnswers}/${latest.totalQuestions}</p>
			<p class="attempt-line"><strong>Placed Level:</strong> ${capitalize(latest.level)}</p>
			<p class="attempt-line"><strong>Checked At:</strong> ${formatDateTime(latest.createdAt)}</p>
		`
	}

	const renderHistory = (history) => {
		if (!history || !history.length) {
			elements.historyList.innerHTML = '<li class="history-empty">No attempts yet.</li>'
			return
		}

		elements.historyList.innerHTML = history
			.slice()
			.reverse()
			.map((item) => {
				return `
					<li class="history-item">
						<span>${formatDateTime(item.createdAt)}</span>
						<span class="history-score">${item.score}%</span>
						<span class="history-level level-${item.level}">${capitalize(item.level)}</span>
					</li>
				`
			})
			.join("")
	}

	const renderData = (payload) => {
		const latest = payload.latest
		const stats = payload.stats || {}

		elements.currentLevel.textContent = latest
			? `${capitalize(latest.level)} Level`
			: "Assessment Pending"

		elements.latestMeta.textContent = latest
			? `Last updated ${formatDateTime(latest.createdAt)}. Keep improving to move up levels.`
			: "No attempt found yet. Start your level check to get placed." 

		elements.latestScore.textContent = latest ? `${latest.score}%` : "--"
		elements.bestScore.textContent = `${stats.highestScore || 0}%`
		elements.attemptCount.textContent = String(stats.attempts || 0)
		elements.trackPreference.textContent = payload.trackPreference || "Not set yet"
		startButtonDefaultLabel = latest ? "Retake Level Check" : "Start Level Check"
		elements.startAssessmentBtn.textContent = startButtonDefaultLabel

		renderLatestAttempt(latest)
		renderHistory(payload.history || [])
	}

	const setLiveState = (message, isHealthy = true) => {
		elements.livePill.textContent = message
		elements.livePill.style.borderColor = isHealthy
			? "rgba(39, 191, 134, 0.45)"
			: "rgba(209, 155, 77, 0.45)"
		elements.livePill.style.background = isHealthy
			? "rgba(39, 191, 134, 0.12)"
			: "rgba(209, 155, 77, 0.16)"
	}

	const fetchAssessmentStatus = async (authToken) => {
		const response = await window.Api.apiRequest("/progress/assessment-status", {
			method: "GET",
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		})

		return response?.data || null
	}

	const formatTimer = (totalSeconds) => {
		const safeValue = Math.max(0, totalSeconds)
		const minutes = Math.floor(safeValue / 60)
		const seconds = safeValue % 60
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
	}

	const hideCountdown = () => {
		elements.countdownOverlay.classList.remove("active")
		elements.countdownOverlay.setAttribute("aria-hidden", "true")
		elements.startAssessmentBtn.disabled = false
		elements.startAssessmentBtn.textContent = startButtonDefaultLabel
		elements.countdownRing.style.setProperty("--progress", "100%")
		elements.countdownTime.textContent = "00:30"
	}

	const stopCountdown = () => {
		if (countdownHandle) {
			clearInterval(countdownHandle)
			countdownHandle = null
		}
		countdownTarget = null
	}

	const startCountdown = () => {
		if (countdownHandle) {
			return
		}

		countdownTarget = Date.now() + QUIZ_START_DELAY_SECONDS * 1000
		elements.countdownOverlay.classList.add("active")
		elements.countdownOverlay.setAttribute("aria-hidden", "false")
		elements.startAssessmentBtn.disabled = true
		elements.startAssessmentBtn.textContent = "Preparing..."

		const tick = () => {
			const remainingMs = countdownTarget - Date.now()
			const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
			const progress = Math.max(
				0,
				Math.min(100, (remainingSeconds / QUIZ_START_DELAY_SECONDS) * 100)
			)

			elements.countdownRing.style.setProperty("--progress", `${progress}%`)
			elements.countdownTime.textContent = formatTimer(remainingSeconds)

			if (remainingSeconds <= 0) {
				stopCountdown()
				window.location.href = "/quiz?assessment=true"
			}
		}

		tick()
		countdownHandle = setInterval(tick, 200)
	}

	const poll = async (authToken) => {
		try {
			const data = await fetchAssessmentStatus(authToken)
			if (!data) {
				setLiveState("No data received from database", false)
				return
			}

			if (!data.onboardingCompleted) {
				window.location.href = "/onboarding"
				return
			}

			renderData(data)
			setLiveState(`Live sync: ${formatDateTime(data.liveTimestamp)}`)
		} catch (error) {
			console.error("Failed to fetch assessment status:", error)
			setLiveState("Database sync issue. Retrying...", false)
		}
	}

	const init = async () => {
		if (window.UI) {
			window.UI.renderFlashFromStorage()
		}

		const authData = window.Auth?.getAuthData()
		if (!authData?.token) {
			window.location.href = "/login?next=/assessment"
			return
		}

		elements.startAssessmentBtn.addEventListener("click", () => {
			startCountdown()
		})

		elements.goDashboardBtn.addEventListener("click", () => {
			window.location.href = "/dashboard"
		})

		elements.cancelCountdownBtn.addEventListener("click", () => {
			stopCountdown()
			hideCountdown()
		})

		await poll(authData.token)

		pollHandle = setInterval(() => {
			poll(authData.token)
		}, POLL_INTERVAL_MS)
	}

	window.addEventListener("beforeunload", () => {
		if (pollHandle) {
			clearInterval(pollHandle)
		}

		stopCountdown()
	})

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init)
	} else {
		init()
	}
})()
