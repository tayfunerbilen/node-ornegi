export const getLoginController = (req, res) => {
	res.render('auth/login')
}

export const postLoginController = (req, res) => {
	const {username, password} = req.body
	res.locals.formData = req.body
	let error
	if (!username) {
		error = 'kullanici adi bos olamaz'
	} else if (!password) {
		error = 'Parola bos olamaz'
	} else if (username !== 'tayfun' || password !== '123') {
		error = 'Kullanici adi ya da parola dogru degil'
	} else {

		req.session.username = username
		res.redirect('/')

	}

	res.render('auth/login', {
		error
	})
}

export const logoutController = (req, res) => {
	req.session.destroy()
	res.redirect('/')
}
