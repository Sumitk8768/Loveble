import express from "express"
import morgan from "morgan"
import router from "./index.router.js"
import type { Request, Response, NextFunction } from "express"
import proxy from "express-http-proxy"
import { createProxyMiddleware } from "http-proxy-middleware"

const app = express()
app.use(morgan("dev"))

const proxyMap: { [key: string]: Function } = {}

function getProxy(uniqueId: string){
   if(proxyMap[uniqueId]){
      return proxyMap[uniqueId]
   }

   const proxyMiddleware = createProxyMiddleware({
       target: `http://nextjs-service-${uniqueId}`,
       changeOrigin: true,
       pathRewrite: {
           '^/': '/'
       }
   });

   proxyMap[uniqueId] = proxyMiddleware;

   return proxyMiddleware;
}

app.use("/api/projects", router)

app.get("/_status/healthz", (req: Request, res: Response) => {
    res.status(200).json({ message: "Project server is healthy" })
})

app.get("/_status/readyz", (req: Request, res: Response) => {
    res.status(200).json({ message: "Project server is healthy" })
})


app.use((req: Request, res: Response, next: NextFunction) => {
    const host = req.headers.host || "";

    if(!host.includes("preview")){
       return next()
    }

    const subdomains = host.split(".")

    const uniqueId = subdomains[0]

    if(!uniqueId)
    {
        return res.status(400).json({ message: "Invalid preview URL" })
    }
    return getProxy(uniqueId)(req, res, next)
})

export default app;