export const authMiddleware = (req, res, next) => {
	if (req.session.username) {
		return res.redirect('/')
	}
	next()
}
