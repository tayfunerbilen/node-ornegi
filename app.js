import "./utils/env.js"
import express from "express"
import session from "express-session"
import fileUpload from "express-fileupload"
import auth from "./routes/auth.js";
import {decrypt} from "./utils/crypto.js";
import {logger} from "./utils/logger.js";

const app = express()
const port = process.env.PORT || 3002

app.set('view engine', 'ejs')
app.use(express.urlencoded({
	extended: true
}))
app.use('/assets', express.static('assets'))
app.use('/upload', express.static('upload'))
app.use(
	fileUpload({
		// safeFileNames: true,
		//preserveExtension: true,
		useTempFiles: true
	})
)
app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: true
	})
)

app.use((req, res, next) => {
	res.locals.session = req.session
	res.locals.decrypt = decrypt
	next()
})

app.get('/', (req, res) => {
	res.render('index', {
		title: 'deneme baslik',
		greeting: 'Hosgeldin gardas!'
	})
})

app.use('/auth', auth)

app.use((err, req, res, next) => {

	logger.error(`${req.method} ${req.url} - ${err.message}`, {
		timestamp: new Date(),
		stack: err.stack,
	});

	res.status(500).send('Bir hata meydana geldi!')

	//next()
})

app.listen(port, () => console.log(`http://localhost:${port} portundan dinleniyor`))
