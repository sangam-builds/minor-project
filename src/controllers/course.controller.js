const Course = require("../models/Course.model.js")
const Topic = require("../models/Topic.model.js")
const Quiz = require("../models/Quiz.model.js")
const Progress = require("../models/Progress.model.js")
const { sendSuccess, sendError } = require("../utils/response.utils.js")

const levelPriority = {
	beginner: 0,
	intermediate: 1,
	advanced: 2,
}

const getTrackFromPreference = (trackPreference = "") => {
	const value = String(trackPreference || "").toLowerCase()
	if (value.includes("backend") || value.includes("node")) {
		return "nodejs"
	}
	if (value.includes("dsa") || value.includes("cpp") || value.includes("c++")) {
		return "dsa-cpp"
	}
	return "other"
}

const sortCoursesByLevel = (a, b) => {
	const left = levelPriority[String(a.level || "beginner").toLowerCase()] ?? 0
	const right = levelPriority[String(b.level || "beginner").toLowerCase()] ?? 0
	if (left !== right) {
		return left - right
	}

	return String(a.title || "").localeCompare(String(b.title || ""))
}

const getRecommendedCoursePlan = async (req, res, next) => {
	try {
		const preferredLevel = String(req.user.level || "beginner").toLowerCase()
		const preferredTrack = String(
			req.user.assessedTrack || getTrackFromPreference(req.user.onboarding?.track_preference)
		).toLowerCase()
		const requestedCourseId = String(req.query.courseId || "").trim()
		const requestedTopicId = String(req.query.topicId || "").trim()
		const allottedCourseId = req.user.allottedCourseId
			? String(req.user.allottedCourseId)
			: ""

		const allCourses = await Course.find({ isPublished: true })
			.select("_id title description level totalTopics track")
			.lean()

		if (!allCourses.length) {
			return sendError(res, 404, "No published courses found")
		}

		const sortedCourses = [...allCourses].sort(sortCoursesByLevel)
		let selectedCourse =
			(requestedCourseId
				? sortedCourses.find((course) => String(course._id) === requestedCourseId)
				: null) ||
			(allottedCourseId
				? sortedCourses.find((course) => String(course._id) === allottedCourseId)
				: null) ||
			(preferredTrack !== "other"
				? sortedCourses.find(
						(course) =>
							String(course.track || "other").toLowerCase() === preferredTrack &&
							String(course.level || "beginner").toLowerCase() === preferredLevel
				  ) ||
				  sortedCourses.find(
						(course) => String(course.track || "other").toLowerCase() === preferredTrack
				  )
				: null) ||
			sortedCourses.find((course) => String(course.level).toLowerCase() === preferredLevel) ||
			sortedCourses[0]

		const topics = await Topic.find({
			courseId: selectedCourse._id,
			isPublished: true,
		})
			.sort({ order: 1, _id: 1 })
			.select("_id title content order duration")
			.lean()

		const topicIds = topics.map((topic) => topic._id)
		const [topicQuizzes, progressRows] = await Promise.all([
			Quiz.find({
				topicId: { $in: topicIds },
				isAssessment: false,
				isPublished: true,
			})
				.select("_id topicId passingScore")
				.lean(),
			Progress.find({
				userId: req.user._id,
				courseId: selectedCourse._id,
				topicId: { $in: topicIds },
				isAssessment: false,
			})
				.select("topicId score passingScore createdAt")
				.sort({ createdAt: -1 })
				.lean(),
		])

		const quizByTopicId = new Map(
			topicQuizzes.map((quiz) => [String(quiz.topicId), quiz])
		)

		const latestAttemptByTopicId = new Map()
		for (const row of progressRows) {
			const topicId = String(row.topicId)
			if (!latestAttemptByTopicId.has(topicId)) {
				latestAttemptByTopicId.set(topicId, row)
			}
		}

		let canUnlockNext = true
		let completedTopics = 0

		const topicPlan = topics.map((topic) => {
			const topicId = String(topic._id)
			const quiz = quizByTopicId.get(topicId) || null
			const attempt = latestAttemptByTopicId.get(topicId) || null

			const passThreshold = attempt?.passingScore || quiz?.passingScore || 70
			const quizTaken = Boolean(attempt)
			const quizPassed = quizTaken ? attempt.score >= passThreshold : false
			const unlocked = canUnlockNext

			if (quizPassed) {
				completedTopics += 1
			}

			if (unlocked) {
				canUnlockNext = quizPassed
			}

			return {
				id: topicId,
				courseId: String(selectedCourse._id),
				title: topic.title,
				order: topic.order,
				duration: topic.duration,
				content: topic.content,
				quizId: quiz ? String(quiz._id) : null,
				quizTaken,
				quizPassed,
				latestScore: attempt?.score ?? null,
				unlocked,
			}
		})

		const nextTopic = topicPlan.find((topic) => topic.unlocked && !topic.quizPassed) || null
		let activeTopicId = nextTopic?.id || topicPlan.find((topic) => topic.unlocked)?.id || null
		if (requestedTopicId) {
			const requestedTopic = topicPlan.find((topic) => topic.id === requestedTopicId)
			if (requestedTopic && requestedTopic.unlocked) {
				activeTopicId = requestedTopic.id
			}
		}

		return sendSuccess(res, 200, "Recommended course plan fetched", {
			user: {
				name: req.user.name,
				assessmentLevel: preferredLevel,
			},
			course: {
				id: String(selectedCourse._id),
				title: selectedCourse.title,
				description: selectedCourse.description,
				level: selectedCourse.level,
				track: selectedCourse.track || "other",
				totalTopics: topicPlan.length,
				completedTopics,
				progressPercent:
					topicPlan.length > 0
						? Math.round((completedTopics / topicPlan.length) * 100)
						: 0,
			},
			topics: topicPlan,
			activeTopicId,
			nextTopicId: nextTopic?.id || null,
		})
	} catch (error) {
		next(error)
	}
}

module.exports = {
	getRecommendedCoursePlan,
}
