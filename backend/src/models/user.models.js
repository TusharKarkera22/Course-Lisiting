import mongoose, { Schema } from "mongoose";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
    purchasedCourse: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
        status: {
          type: String,
          enum: ['in-progress', 'completed'],
          default: 'in-progress'
        },
        progress: {
          type: Number, 
          default: 0
        }
      }
    ],
  },
  {
    timestamps: true,
  }
);

// Encrypting the password just before storing into database
userSchema.pre("save", async function (next) {
  // To avoid hashing of password for every change in data.
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// To check if the password is right
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  // JWT sign takes payload, token secret & expiry
  return Jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return Jwt.sign(
    {
      _id: this._id,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
