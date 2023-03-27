import {validationResult} from "express-validator";
import slugify from "slugify";
import User from "../models/user.js";
import {decrypt, encrypt} from "../utils/crypto.js";

export const getRegisterController = (req, res) => {
	res.render('auth/register')
}

export const getLoginController = (req, res) => {
	res.render('auth/login')
}

export const postLoginController = async (req, res, next) => {
	const {username, password} = req.body
	res.locals.formData = req.body
	let error
	if (!username) {
		error = 'kullanici adi bos olamaz'
	} else if (!password) {
		error = 'Parola bos olamaz'
	} else {

		try {
			const user = await User.login(username, password)
			if (user) {
				req.session.username = user.username
				req.session.user_id = encrypt(String(user.id))
				res.redirect('/')
			} else {
				error = 'Bu bilgilere ait kullanici bulunamadi!'
			}
		} catch (err) {
			next(err)
		}

	}

	if (error) {
		res.render('auth/login', {
			error
		})
	}

}

export const postRegisterController = (req, res) => {
	res.locals.formData = req.body

	const errors = validationResult(req);
	// if (!errors.isEmpty()) {
	// 	return res.status(400).json({
	// 		errors: errors.array()
	// 	});
	// }

	// hata yoksa
	if (errors.isEmpty()) {

		let avatar = req.files.avatar
		let file = avatar.name.split('.')
		let fileExtension = file.pop()
		let fileName = file.join('')
		let path = 'upload/' + Date.now() + '-' + slugify(fileName, {
			lower: true,
			locale: 'tr',
			strict: true
		}) + '.' + fileExtension;

		avatar.mv(path, async err => {
			if (err) {
				return res.status(500).send(err);
			}

			// model yapisi
			const response = await User.create({
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
				avatar: path
			})
			const user = await User.findById(response.insertId)

			req.session.username = user.username
			req.session.user_id = user.id
			res.redirect('/')

		})

	} else {
		res.render('auth/register', {
			errors: errors.array()
		})
	}

}

export const logoutController = (req, res) => {
	req.session.destroy()
	res.redirect('/')
}
