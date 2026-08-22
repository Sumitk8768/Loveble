import type { Request, Response } from "express";
import { createPod, createService } from "../service/kubernetes.service.js"
import { v4 as uuidv4 } from "uuid";


export const createPodController = async (req: Request, res: Response) => {
    
    const uniqwId = uuidv4();

    const podName = `nextjs-pod-${uniqwId}`
    const serviceName = `nextjs-service-${uniqwId}`

    await createPod(podName)
    await createService(serviceName, podName)
    res.status(200).json({ message: "Pod created successfully" })
}