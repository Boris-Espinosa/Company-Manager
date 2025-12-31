import express from 'express'
import cors from 'cors'
import companiesRoute from './src/routes/companies.route.ts'
import usersRoute from './src/routes/users.route.ts'
import tasksRoute from './src/routes/tasks.route.ts'

const PORT = process.env.PORT ?? 3000

const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/companies', companiesRoute)
app.use('/api/users', usersRoute)
app.use('/api/tasks', tasksRoute)

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})