import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Admin } from "../models/admin.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { Course } from "../models/course.models.js";



const accessTokenAndRefreshToken = async(userId) => {
    const admin = await Admin.findById(userId);
    const accessToken = admin.generateAccessToken()
    const refreshToken = admin.generateRefreshToken()

    admin.refreshToken = refreshToken

    await admin.save({ validateBeforeSave: false })

    return { accessToken, refreshToken}
}

const registerAdmin = asyncHandler( async(req, res) => {

    //getting details from frontend
    const { username, password } = req.body;
    // console.log("username", username);

    //checking if the field is empty
    if (
        [username, password].some( (field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Username & Password both are required")
    }

    //To check if the admin already exists
    const existingAdmin = await Admin.findOne({username})

    if(existingAdmin){
        throw new ApiError(409, "Admin with the username already exists")
    }

    //entry in database
    const admin = await Admin.create({
        username: username.toLowerCase(),
        password
    })

    //Removing password and refreshToken from response
    const createdAdmin = await Admin.findById(admin._id).select(
        "-password, -refreshToken"
    )

    //checking for the admin creation
    if (!createdAdmin) {
        throw new ApiError(500, "Something went wrong while registering admin")
    }

    //sending the response
    return res.status(200).json(
        new ApiResponse(200, "Admin created successfully")
    )
})

const logInAdmin = asyncHandler( async(req, res) => {
    const { username, password } = req.body;
    
    const existingAdmin = await Admin.findOne({username})

    if(!existingAdmin || !(await existingAdmin.isPasswordCorrect(password))){
        throw new ApiError(409, "Admin doesn't exist")
    }

    const {accessToken, refreshToken} = await accessTokenAndRefreshToken(existingAdmin._id)
    console.log(accessToken, refreshToken);

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshTokens", refreshToken, options)
    .json(
        new ApiResponse
        (
            200,
            {
                accessToken, refreshToken,existingAdmin
            },
            "Admin logged in successfully"
        )
    )
    
})

const creatingCourse = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        price,
        instructor,
        enrollmentStatus,
        duration,
        schedule,
        location,
        prerequisites = [],
        syllabus = ""  
    } = req.body;

    
    if (
        [title, description, price, instructor, enrollmentStatus, duration, schedule, location].some(field => !field || field.trim() === "")
    ) {
        throw new ApiError(400, "All required fields must be filled out");
    }

   
    let syllabusArray = [];
    try {
        
        if (typeof syllabus === 'string' && syllabus.trim() !== "") {
            syllabusArray = JSON.parse(syllabus);

            
            if (!Array.isArray(syllabusArray)) {
                throw new Error("Syllabus should be an array");
            }

            
            syllabusArray = syllabusArray.map(item => {
                if (
                    typeof item.week !== 'number' ||
                    typeof item.topic !== 'string' ||
                    typeof item.content !== 'string'
                ) {
                    throw new Error("Each syllabus item must have week (number), topic (string), and content (string)");
                }
                return {
                    week: Number(item.week),
                    topic: String(item.topic),
                    content: String(item.content)
                };
            });
        } else {
            throw new Error("Syllabus should be a non-empty JSON string");
        }
    } catch (error) {
        throw new ApiError(400, `Invalid syllabus format: ${error.message}`);
    }

    
    const imageLinkLocalPath = req.files?.imageLink?.[0]?.path;
    if (!imageLinkLocalPath) {
        throw new ApiError(400, "Image file is required");
    }


    let imageLink;
    try {
        imageLink = await uploadOnCloudinary(imageLinkLocalPath);
        if (!imageLink) {
            throw new Error("Failed to upload image");
        }
    } catch (error) {
        throw new ApiError(400, `Image upload error: ${error.message}`);
    }

    // Creating course
    try {
        const course = await Course.create({
            title,
            description,
            price,
            imageLink: imageLink.url,
            instructor,
            enrollmentStatus,
            duration,
            schedule,
            location,
            prerequisites,
            syllabus: syllabusArray  
        });
        res.status(200).json(new ApiResponse(200, course._id, "Course created successfully"));
    } catch (error) {
        throw new ApiError(500, `Failed to create course: ${error.message}`);
    }
});


const viewingCourses = asyncHandler( async(req, res) => {
    const allCourses = await Course.find({})

    res.status(200).json(
        new ApiResponse(200, allCourses)
    )
})

export { registerAdmin, logInAdmin, creatingCourse, viewingCourses }