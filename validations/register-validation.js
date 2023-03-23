import {body, check} from "express-validator";

export const registerValidation = () => [

	body('username')
		.isLength({ min: 3, max: 10 })
		.withMessage('Kullanıcı adı en az 3 karakter olmalıdır.')
		.isAlphanumeric()
		.withMessage('Kullanıcı adı sadece sayı ve harflerden oluşmalıdır.'),

	body('email')
		.isEmail()
		.withMessage('Geçerli bir e-posta adresi girin.'),

	body('password')
		.isLength({ min: 6 })
		.withMessage('Şifre en az 6 karakter uzunluğunda olmalıdır.'),

	body('passwordConfirmation').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Şifre doğrulama eşleşmiyor.');
		}
		return true;
	}),

	check('avatar')
		.custom((value, { req }) => {
			if (!req?.files?.avatar) {
				throw new Error('Profil resmi yüklenmelidir.');
			}
			const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
			const profileImage = req.files.avatar;
			if (!allowedMimeTypes.includes(profileImage.mimetype)) {
				throw new Error('Sadece .jpeg, .png ve .gif formatlarında dosya yükleyebilirsiniz.');
			}
			if (profileImage.size > 5 * 1024 * 1024) {
				throw new Error('Dosya boyutu 5 MB\'ı geçemez.');
			}
			return true;
		}),

]
