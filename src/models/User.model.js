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
		onboardingCompleted: {
			type: Boolean,
			default: false,
		},
		onboarding: {
			learning_interest: {
				type: [String],
				default: [],
			},
			experience_level: {
				type: String,
				default: "",
			},
			learning_goal: {
				type: String,
				default: "",
			},
			time_commitment: {
				type: String,
				default: "",
			},
			learning_style: {
				type: String,
				default: "",
			},
			prior_experience: {
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
