const User = require("../models/User")
const Profile = require("../models/Profile")
const Course = require("../models/Course")
const mongoose = require("mongoose")

// Update Profile
exports.updateProfile = async (req, res) => {
    try {
        // get data from request body
        const { firstName = "", lastName = "", gender = "", about = "", dateOfBirth = "", contactNumber = "" } = req.body

        // get the user id from req.user (from auth middleware)
        const userId = req.user.id

        // get the user details
        const userDetails = await User.findById({ _id: userId })

        // get the profile details of the user
        const profileDetails = await Profile.findById({ _id: userDetails.additionalDetails })

        // update the user
        await User.findByIdAndUpdate(
            { _id: userDetails._id },
            { firstName, lastName },
            { new: true }
        )

        // update the profile
        await Profile.findByIdAndUpdate(
            { _id: profileDetails._id },
            { gender, about, dateOfBirth, contactNumber },
            { new: true }
        )

        // show the updated user details
        const updatedUserDetails = await User.findById({ _id: userDetails._id })
            .populate("additionalDetails")
            .exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Profile is updated successfully",
            updatedUserDetails
        })

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while updating the profile",
            error: err.message
        })
    }
}

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        // get the user id from req.user (from auth middleware)
        const userId = req.user.id

        // get the user details
        const user = await User.findById({ _id: userId })

        // validation of the user
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User is not found"
            })
        }

        // delete the profile of the user
        await Profile.findByIdAndDelete(
            { _id: new mongoose.Types.ObjectId(user.additionalDetails) }
        )

        // delete the user from the course
        for (const courseId of user.courses) {
            await Course.findByIdAndUpdate(
                { _id: courseId },
                {
                    $pull: { studentsEnrolled: userId }
                },
                { new: true }
            )
        }

        // delete the user
        await User.findByIdAndDelete({ _id: userId })

        // return the response
        return res.status(200).json({
            success: true,
            message: "Account is deleted successfully"
        })
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while deleting the account",
            error: err.message
        })
    }
}

// Get all User Details
exports.getAllUserDetails = async (req,res) => {
    try {
        // get user id from req.user (from auth middleware)
        const userId = req.user.id

        // get all the user details
        const userDetails = await User.findById({_id: userId})
        .populate("additionalDetails")
        .exec()

        // return the response
        return res.status(200).json({
            success: true,
            message: "Got all the user details successfully",
            userDetails
        })
        
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching all the user details",
            error: err.message
        })
    }
}