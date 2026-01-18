import dotenv from "dotenv"
import connectDB from "./src/db/db.js"
import { app } from './src/app.js'
import User from './src/models/User.model.js'
import Department from './src/models/Department.model.js'
import Service from './src/models/Service.model.js'

dotenv.config({
    path: './.env'
})

connectDB()
    .then(async () => {

        app.listen(process.env.PORT || 5000, () => {
            console.log(`\n🚀 Nexus Gateway running at http://localhost:${process.env.PORT || 5000}`)
        })
    })
    .catch((err) => {
        console.log("MongoDB connection failed:", err)
    })