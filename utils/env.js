import dotenv from "dotenv";

const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env';
dotenv.config({
	path: envFile
});
