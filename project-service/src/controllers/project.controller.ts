import type { Request, Response } from "express";
import { createPod, createService } from "../service/kubernetes.service.js"
import { v4 as uuidv4 } from "uuid";
import { recordActivity } from "../service/activity.service.js"

export const createPodController = async (req: Request, res: Response) => {
    
    const uniqueId = uuidv4();

    const podName = `nextjs-pod-${uniqueId}`
    const serviceName = `nextjs-service-${uniqueId}`

    await createPod(podName)
    await createService(serviceName, podName)
    await recordActivity(uniqueId)

    res.status(200).json({ 
        message: "Pod created successfully" ,
        previewUrl: `http://${uniqueId}.preview.localhost`
    })
}
