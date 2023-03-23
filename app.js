import express from "express"
import dotenv from "dotenv"
import session from "express-session"

import auth from "./routes/auth.js";

dotenv.config()

const app = express()
const port = process.env.PORT || 3002

app.set('view engine', 'ejs')
app.use(express.urlencoded({
	extended: true
}))
app.use(
	session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: true
	})
)

app.use((req, res, next) => {
	res.locals.session = req.session
	next()
})

app.get('/', (req, res) => {
	res.render('index', {
		title: 'deneme baslik',
		greeting: 'Hosgeldin gardas!'
	})
})

app.use('/auth', auth)

app.listen(port, () => console.log(`http://localhost:${port} portundan dinleniyor`))
