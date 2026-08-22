import app from "./app/app.js"

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
    console.log(`Project service is running on port ${port}`)
})