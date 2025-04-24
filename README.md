 Problem Statement: Feedback System for a Learning App
You're building an API for a learning app where users can log in and submit feedback. You need to:
1.Login Route (/login):
Accepts userName and password.
Verifies credentials from a predefined array of users.
Returns a JWT token if valid.
POST /feedback Route:
Accepts title (min 5 chars) and message (min 20 chars).
Requires JWT authentication using a middleware.
Uses Zod to validate the request body.
Returns success message if valid, or errors if not.
