import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import dotenv from 'dotenv';
dotenv.config();

// app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

// middlewares
app.use(express.json())
app.use(cors())

// api end point
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
  res.send('Api working...')
})

app.listen(port, () => console.log('Server started', port)) 
//db connection
//ravikumarbharti959493
//kxhYQLWEd70VGl7P
//mongodb+srv://ravikumarbharti959493:kxhYQLWEd70VGl7P@cluster0.pb6oh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0