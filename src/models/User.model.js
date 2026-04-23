const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: true,
			minlength: 6,
		},
		googleId: {
			type: String,
			unique: true,
			sparse: true,
			trim: true,
		},
		authProvider: {
			type: String,
			enum: ["local", "google"],
			default: "local",
		},
		level: {
			type: String,
			enum: ["beginner", "intermediate", "advanced"],
			default: "beginner",
		},
		onboardingCompleted: {
			type: Boolean,
			default: false,
		},
		onboarding: {
			main_goal: {
				type: String,
				default: "",
			},
			background: {
				type: String,
				default: "",
			},
			languages: {
				type: [String],
				default: [],
			},
			track_preference: {
				type: String,
				default: "",
			},
				course_preference: {
					type: String,
					default: "",
				},
			time_commitment: {
				type: String,
				default: "",
			},
			biggest_challenge: {
				type: String,
				default: "",
			},
			completedAt: {
				type: Date,
				default: null,
			},
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model("User", userSchema)
