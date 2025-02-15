import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Jwt from "jsonwebtoken";
import { Admin } from "../models/admin.models.js";


export const verifyJwt = asyncHandler( async(req, res, next) => {
try {
        //Taking access of token
        const token = req.cookies?.accessToken || req.headers["authorization"]?.replace("Bearer ", "");

    
        if(!token){
            throw new ApiError(401, "Unathorized request")
        }
    
        //checking if the recieved token is correct
        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const admin = await Admin.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!admin){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.admin = admin;
        next()
} catch (error) {
    throw new ApiError(401, error?.message || "Invalid Token")
}
})