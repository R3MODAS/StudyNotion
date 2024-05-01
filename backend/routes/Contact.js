// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const { contactUsController } = require("../controllers/ContactUs")

// ********************************************************************************************************
//                                      Contact routes
// ********************************************************************************************************

// Route for contact form submission
router.post("/contact", contactUsController)

// Export the router for use in the main application
module.exports = router