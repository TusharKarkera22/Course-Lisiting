import mongoose, { Schema } from "mongoose";

const syllabusSchema = new Schema({
  week: { type: Number, required: true },
  topic: { type: String, required: true },
  content: { type: String, required: true },
});

const studentSchema = new Schema({
id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageLink: {
      type: String, //cloudinary url
      required: true,
    },
    instructor: {
      type: String,
      required: true,
    },
    enrollmentStatus: {
      type: String,
      enum: ["Open", "Closed", "In Progress"],
      required: true,
    },
    duration: { type: String, required: true },
    schedule: { type: String, required: true },
    location: { type: String, required: true },
    prerequisites: [{ type: String }],
    syllabus: [syllabusSchema],
    students: [studentSchema],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
  }
);

export const Course = mongoose.model("Course", courseSchema);
