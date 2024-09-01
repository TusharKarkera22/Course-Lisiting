import { Router } from "express";
import { verifyUserJwt } from "../middlewares/userAuth.middleware.js";
import { registerUser, loginUser, allCourses, purchasingCourse, myCourses,purchaseCourse, fetchMyCourses, searchCourses } from "../controllers/user.controllers.js";


const router = Router()

router.route("/signup").post(registerUser)

router.route("/signin").post(loginUser)

router.route("/courses").get(verifyUserJwt, allCourses)

router.route("/courses/:courseId").post( purchasingCourse)

router.route("/purchasedCourses").get(verifyUserJwt ,myCourses)
router.route("/purchase/:courseId").post(verifyUserJwt ,purchaseCourse)
router.route("/purchase/:courseId").post(verifyUserJwt ,purchaseCourse)
router.route("/mycourses").get(verifyUserJwt ,fetchMyCourses)
router.route("/:search").post( searchCourses)

export default router