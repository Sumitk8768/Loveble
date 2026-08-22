import express from "express"
import morgan from "morgan"
import router from "./index.router.js"
import type { Request, Response } from "express"

const app = express()
app.use(morgan("dev"))

app.use("/api/projects", router)

app.get("/_status/healthz", (req: Request, res: Response) => {
    res.status(200).json({ message: "Project server is healthy" })
})

app.get("/_status/readyz", (req: Request, res: Response) => {
    res.status(200).json({ message: "Project server is healthy" })
})

export default app;