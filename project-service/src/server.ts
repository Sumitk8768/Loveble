import app from "./app/app.js"
import { startIdleReaper } from "./service/activity.service.js"

await startIdleReaper()

const port = Number(process.env.PORT ?? 3000)

app.listen(port, () => {
    console.log(`Project service is running on port ${port}`)
})