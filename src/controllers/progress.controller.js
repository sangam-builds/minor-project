const Course = require("../models/Course.model.js")
const Topic = require("../models/Topic.model.js")
const Progress = require("../models/Progress.model.js")
const { sendSuccess } = require("../utils/response.utils.js")

const getLevelFromScore = (score) => {
	if (score < 40) {
		return "beginner"
	}

	if (score < 75) {
		return "intermediate"
	}

	return "advanced"
}

const getDateKey = (value) => {
	const date = new Date(value)
	const year = date.getFullYear()
	const month = `${date.getMonth() + 1}`.padStart(2, "0")
	const day = `${date.getDate()}`.padStart(2, "0")
	return `${year}-${month}-${day}`
}

const levelPriority = {
	beginner: 0,
	intermediate: 1,
	advanced: 2,
}

const sortCoursesByLevel = (a, b) => {
	const left = levelPriority[String(a.level || "beginner").toLowerCase()] ?? 0
	const right = levelPriority[String(b.level || "beginner").toLowerCase()] ?? 0

	if (left !== right) {
		return left - right
	}

	return String(a.title || "").localeCompare(String(b.title || ""))
}

const getDashboardSummary = async (req, res, next) => {
	try {
		const userId = req.user._id

		const [topics, allCourses, userProgress, latestAssessment] = await Promise.all([
			Topic.find({ isPublished: true }).select("_id courseId order title").sort({ order: 1 }).lean(),
			Course.find({ isPublished: true }).select("_id title level totalTopics track").lean(),
			Progress.find({ userId })
				.select("topicId courseId isAssessment score passingScore createdAt")
				.sort({ createdAt: 1 })
				.lean(),
			Progress.findOne({ userId, isAssessment: true })
				.select("assessmentTrack recommendedCourseId createdAt")
				.sort({ createdAt: -1 })
				.lean(),
		])

		const totalTopics = topics.length
		const topicToCourse = new Map()
		const courseTopicTotals = new Map()

		for (const topic of topics) {
			const topicId = String(topic._id)
			const courseId = String(topic.courseId)
			topicToCourse.set(topicId, courseId)
			courseTopicTotals.set(courseId, (courseTopicTotals.get(courseId) || 0) + 1)
		}

		const masteredTopics = new Set()
		const activeCourses = new Set()
		const activityByDay = new Map()
		const attemptsByCourse = new Map()
		const attemptsByTopic = new Map()
		let quizzesSolved = 0
		let scoredAttempts = 0
		let scoreTotal = 0

		for (const progress of userProgress) {
			const dayKey = getDateKey(progress.createdAt)
			activityByDay.set(dayKey, (activityByDay.get(dayKey) || 0) + 1)

			if (!progress.isAssessment) {
				quizzesSolved += 1
				scoredAttempts += 1
				scoreTotal += progress.score
			}

			if (!progress.topicId) {
				continue
			}

			const topicId = String(progress.topicId)
			const courseId = progress.courseId
				? String(progress.courseId)
				: topicToCourse.get(topicId)

			if (courseId) {
				activeCourses.add(courseId)

				if (!progress.isAssessment) {
					const attempts = attemptsByCourse.get(courseId) || []
					attempts.push({
						topicId,
						score: progress.score,
						passingScore: progress.passingScore || 70,
						createdAt: progress.createdAt,
					})
					attemptsByCourse.set(courseId, attempts)
					attemptsByTopic.set(topicId, {
						topicId,
						courseId,
						score: progress.score,
						passingScore: progress.passingScore || 70,
						createdAt: progress.createdAt,
					})
				}
			}

			if (progress.score >= (progress.passingScore || 70)) {
				masteredTopics.add(topicId)
			}
		}

		const masteredByCourse = new Map()
		for (const topicId of masteredTopics) {
			const courseId = topicToCourse.get(topicId)
			if (!courseId) {
				continue
			}
			masteredByCourse.set(courseId, (masteredByCourse.get(courseId) || 0) + 1)
		}

		let finishedPaths = 0
		let inProgressPaths = 0
		for (const course of allCourses) {
			const courseId = String(course._id)
			const masteredCount = masteredByCourse.get(courseId) || 0
			const topicCount = courseTopicTotals.get(courseId) || 0

			if (topicCount > 0 && masteredCount >= topicCount) {
				finishedPaths += 1
			} else if (masteredCount > 0 || activeCourses.has(courseId)) {
				inProgressPaths += 1
			}
		}

		const today = new Date()
		today.setHours(0, 0, 0, 0)
		let dayStreak = 0
		for (let offset = 0; offset < 365; offset += 1) {
			const current = new Date(today)
			current.setDate(today.getDate() - offset)
			const key = getDateKey(current)

			if (!activityByDay.has(key)) {
				break
			}

			dayStreak += 1
		}

		const activity = []
		const start = new Date(today)
		start.setDate(today.getDate() - 13)
		for (let i = 0; i < 14; i += 1) {
			const current = new Date(start)
			current.setDate(start.getDate() + i)
			const label = `${current.toLocaleDateString("en-US", {
				weekday: "short",
			})} ${current.getDate()}`
			const key = getDateKey(current)
			activity.push({ label, value: activityByDay.get(key) || 0 })
		}

		const topicsMastered = masteredTopics.size
		const averageScore = scoredAttempts > 0 ? Math.round(scoreTotal / scoredAttempts) : 0
		const overallProgress = totalTopics > 0 ? Math.round((topicsMastered / totalTopics) * 100) : 0

		const courseById = new Map(allCourses.map((course) => [String(course._id), course]))
		const topicsByCourse = new Map()
		for (const topic of topics) {
			const courseId = String(topic.courseId)
			const list = topicsByCourse.get(courseId) || []
			list.push({
				id: String(topic._id),
				order: topic.order,
				title: topic.title,
			})
			topicsByCourse.set(courseId, list)
		}

		const difficultyTotals = {
			beginner: 0,
			intermediate: 0,
			advanced: 0,
		}

		for (const [courseId, masteredCount] of masteredByCourse.entries()) {
			const course = courseById.get(courseId)
			if (!course || !course.level) {
				continue
			}

			const level = String(course.level).toLowerCase()
			if (level in difficultyTotals) {
				difficultyTotals[level] += masteredCount
			}
		}

		const transformation = []
		for (const [courseId, attempts] of attemptsByCourse.entries()) {
			if (!attempts.length) {
				continue
			}

			const course = courseById.get(courseId)
			if (!course) {
				continue
			}

			const started = Math.max(0, Math.min(100, Math.round(attempts[0].score)))
			const current = Math.max(0, Math.min(100, Math.round(attempts[attempts.length - 1].score)))
			transformation.push({
				courseId,
				title: course.title,
				started,
				current,
				gain: current - started,
			})
		}

		transformation.sort((a, b) => b.current - a.current)
		const avgGain = transformation.length
			? Math.round(
					transformation.reduce((sum, item) => sum + item.gain, 0) / transformation.length
				)
			: 0

		const preferredLevel = String(req.user.level || "beginner").toLowerCase()
		const preferredTrack =
			String(req.user.assessedTrack || latestAssessment?.assessmentTrack || "other").toLowerCase()
		const sortedCourses = [...allCourses].sort(sortCoursesByLevel)
		const allottedFromUser = req.user.allottedCourseId ? String(req.user.allottedCourseId) : null
		const allottedFromAssessment = latestAssessment?.recommendedCourseId
			? String(latestAssessment.recommendedCourseId)
			: null

		let allottedCourse = null
		if (allottedFromUser) {
			allottedCourse = sortedCourses.find((course) => String(course._id) === allottedFromUser) || null
		}
		if (!allottedCourse && allottedFromAssessment) {
			allottedCourse =
				sortedCourses.find((course) => String(course._id) === allottedFromAssessment) || null
		}
		if (!allottedCourse && preferredTrack !== "other") {
			allottedCourse =
				sortedCourses.find(
					(course) =>
						String(course.track || "other").toLowerCase() === preferredTrack &&
						String(course.level || "beginner").toLowerCase() === preferredLevel
				) ||
				sortedCourses.find(
					(course) => String(course.track || "other").toLowerCase() === preferredTrack
				) ||
				null
		}
		if (!allottedCourse) {
			allottedCourse =
				sortedCourses.find((course) => String(course.level).toLowerCase() === preferredLevel) ||
				sortedCourses[0] ||
				null
		}

		const pathSourceIds = allottedCourse ? [String(allottedCourse._id)] : []

		const learningPaths = pathSourceIds
			.map((courseId) => {
				const course = courseById.get(courseId)
				if (!course) {
					return null
				}

				const topicCount = courseTopicTotals.get(courseId) || course.totalTopics || 0
				const masteredCount = masteredByCourse.get(courseId) || 0
				const completion = topicCount > 0 ? Math.round((masteredCount / topicCount) * 100) : 0
				const attempts = attemptsByCourse.get(courseId) || []
				const started = attempts.length ? Math.round(attempts[0].score) : 0
				const current = attempts.length ? Math.round(attempts[attempts.length - 1].score) : started
				const courseTopics = topicsByCourse.get(courseId) || []
				const latestAttempt = attempts.length ? attempts[attempts.length - 1] : null
				const latestTopicIndex = latestAttempt
					? courseTopics.findIndex((topic) => topic.id === latestAttempt.topicId)
					: -1
				const isPassed = latestAttempt ? latestAttempt.score >= latestAttempt.passingScore : false
				const resumeTopic =
					latestTopicIndex >= 0
						? courseTopics[isPassed ? latestTopicIndex + 1 : latestTopicIndex]
						: courseTopics[0] || null

				return {
					id: courseId,
					title: course.title,
					level: String(course.level || "beginner"),
					topicsCompleted: masteredCount,
					topicsTotal: topicCount,
					completion,
					started,
					current,
					gain: current - started,
					resumeTarget: resumeTopic
						? {
							courseId,
							topicId: resumeTopic.id,
							topicTitle: resumeTopic.title,
						}
						: null,
				}
			})
			.filter(Boolean)

		learningPaths.sort((a, b) => b.current - a.current)

		return sendSuccess(res, 200, "Dashboard summary fetched", {
			userName: req.user.name,
			recommendedTrack: preferredTrack,
			stats: {
				activePaths: finishedPaths + inProgressPaths,
				topicsMastered,
				totalTopics,
				quizzesSolved,
				averageScore,
				dayStreak,
			},
			overallProgress: {
				percentage: overallProgress,
				finished: finishedPaths,
				inProgress: inProgressPaths,
			},
			learningActivity: activity,
			transformation: {
				avgGain,
				items: transformation,
			},
			topicsByDifficulty: {
				beginner: difficultyTotals.beginner,
				intermediate: difficultyTotals.intermediate,
				advanced: difficultyTotals.advanced,
			},
			learningPaths,
		})
	} catch (error) {
		next(error)
	}
}

const getAssessmentStatus = async (req, res, next) => {
	try {
		const userId = req.user._id

		const attempts = await Progress.find({ userId, isAssessment: true })
			.select("score passingScore totalQuestions correctAnswers createdAt")
			.sort({ createdAt: -1 })
			.limit(10)
			.lean()

		const latestAttempt = attempts[0] || null
		const currentLevel = latestAttempt ? getLevelFromScore(latestAttempt.score) : req.user.level

		const history = attempts
			.slice()
			.reverse()
			.map((attempt) => ({
				score: attempt.score,
				level: getLevelFromScore(attempt.score),
				passingScore: attempt.passingScore,
				totalQuestions: attempt.totalQuestions,
				correctAnswers: attempt.correctAnswers,
				createdAt: attempt.createdAt,
			}))

		res.set("Cache-Control", "no-store")

		return sendSuccess(res, 200, "Assessment status fetched", {
			liveTimestamp: new Date().toISOString(),
			onboardingCompleted: Boolean(req.user.onboardingCompleted),
			trackPreference: req.user.onboarding?.track_preference || "",
			latest: latestAttempt
				? {
					score: latestAttempt.score,
					level: currentLevel,
					passingScore: latestAttempt.passingScore,
					totalQuestions: latestAttempt.totalQuestions,
					correctAnswers: latestAttempt.correctAnswers,
					createdAt: latestAttempt.createdAt,
				}
				: null,
			history,
			stats: {
				attempts: attempts.length,
				highestScore: attempts.length ? Math.max(...attempts.map((item) => item.score)) : 0,
			},
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getDashboardSummary,
	getAssessmentStatus,
}
