
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.models.js";
import mongoose from "mongoose";


const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //Storing refresh tokens in database
        user.refreshToken = refreshToken
        //while saving it validates the password again hence false
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler( async (req, res) => {
    
    //getting details from frontend
    const { username, password } = req.body
    // console.log("username: ", username);

    //Validating username
    if (
        [username, password].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Username & Password both are required")
    }

    //Checking if the User already exist
    const existedUser = await User.findOne({username})

    if(existedUser){
        throw new ApiError("409", "Username already exists")
    }

    //Entry in database
    const user = await User.create({
        username: username.toLowerCase(),
        password
    })

    //Removing password and refreshToken from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //checking for the user creation
    if(!createdUser){
        throw new ApiError("500", "Something went wrong while registering the user")
    }

    //Returning response
    return res.status(201).json(
        new ApiResponse(200, "User created successfully")
    )

})

const loginUser = asyncHandler( async(req, res) => {
    const {username, password} = req.body

    const user = await User.findOne({username})

    if(!user || !(await user.isPasswordCorrect(password))){
        throw new ApiError(409, "User doesn't exist")
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)
    // console.log(accessToken, refreshToken);
    
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                accessToken, refreshToken, user
            },
            "User logged in successfully"
        )
    ) 

})


const allCourses = asyncHandler( async(req, res) => {
    const courses = await Course.find({})

    res.status(200).json(
        new ApiResponse(200, courses)
    )
})

const purchasingCourse = asyncHandler( async(req, res) => {
    const { courseId } = req.params; 
    

   
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        throw new ApiError(400, "Invalid course ID format");
    }

    
    const course = await Course.findById(courseId);

    
    if (!course) {
        throw new ApiError(404, "Course not found");
    }

    res.status(200).json(
        new ApiResponse(200, course, "Course details fetched successfully")
    );
})

const myCourses = asyncHandler( async(req, res) => {
    const username = req.user.username
    const user = await User.findOne({ username })
    // console.log(user);

    if(!user){
        throw new ApiError(404, "User not found")
    }

    const purchasedCourse = await user.populate("purchasedCourse") 

    res.status(200).json(
        new ApiResponse(
            200,
            {
                user: purchasedCourse
            }
            )
    )

})
 const fetchMyCourses = async (req, res) => {
    try {
        const { _id: userId } = req.user; 
      const user = await User.findById(userId).populate({
        path: 'purchasedCourse.courseId',
        model: 'Course'
      });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      console.log("user",user)
  
      // Map through the purchasedCourses to include course details and progress
      const coursesWithProgress = user.purchasedCourse.map(courseDetail => ({
        course: courseDetail.courseId,
        status: courseDetail.status,
        progress: courseDetail.progress
      }));
  
      res.json(coursesWithProgress);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
const purchaseCourse = asyncHandler(async (req, res) => {
    const { courseId } = req.params;
    const { _id: userId } = req.user;
    console.log(req.user)
  console.log(userId)
    // Validate course ID format
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      throw new ApiError(400, "Invalid course ID format");
    }
  
    // Find the course by ID
    const course = await Course.findById(courseId);
  
    // Check if the course exists
    if (!course) {
      throw new ApiError(404, "Course not found");
    }
  
    // Check if the user has already purchased the course
    const user = await User.findById(userId);
    console.log(user)
    if (user && user.purchasedCourse && user.purchasedCourse.length > 0) {
        if (user.purchasedCourse.includes(courseId)) {
          throw new ApiError(400, "Course already purchased");
        }
      }
  
    // Add course to user's purchased courses
    user.purchasedCourse.push(courseId);
    await user.save();
  
    // Return success response
    res.status(200).json(new ApiResponse(200, course, "Course purchased successfully"));
  });
  const searchCourses = asyncHandler(async (req, res) => {
    try {
        const  title  = req.query;

        
        const filter = {};
        if (title) {
            filter.title = { $regex: new RegExp(title, 'i') }; // Case-insensitive search
        }
        

        
        const courses = await Course.find(filter);

        if (!courses.length) {
            return res.status(404).json(new ApiError(404, "No courses found matching the criteria"));
        }

        res.status(200).json(new ApiResponse(200, courses, "Courses fetched successfully"));
    } catch (error) {
        console.error(error);
        res.status(500).json(new ApiError(500, "Internal Server Error"));
    }
});


export { registerUser, loginUser, allCourses, purchasingCourse, myCourses,purchaseCourse ,searchCourses,fetchMyCourses}