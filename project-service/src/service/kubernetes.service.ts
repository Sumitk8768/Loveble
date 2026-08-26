import * as k8s from "@kubernetes/client-node"

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

export async function createPod(podName: string){
    const podManifest = {
        apiVersion: "v1",
        kind: "Pod",
        metadata: {
            name: podName,
            labels: {
                app: podName
            }
        },
        spec: {
            containers: [        
                {
                   name: "nextjs-container",
                   image: "nextjs-boilerplate",
                   imagePullPolicy: "IfNotPresent",
                   ports: [
                    {
                        containerPort: 3000
                    }
                   ],
                   resources: {
                       requests: {
                           memory: "1024Mi",
                           cpu: "500m"
                       },
                       limits: {
                           memory: "2048Mi",
                           cpu: "1000m"
                       }
                   }
                }
            ]  
        }
    };      
    
    const response = await k8sApi.createNamespacedPod({
       namespace: "default",
       body: podManifest
    })

    console.log("Pod created successfully:")
    console.log(response)
}

export async function createService(serviceName: string, pordName: string){
       
    const serviceManifest = {
        apiVersion: "v1",
        kind: "Service",
        metadata: {
            name: serviceName,
            labels: {
                app: pordName
            }
        },
        spec: {
            selector: {
                app: pordName
            },
            ports: [
                {   
                    protocol: "TCP",
                    port: 80,
                    targetPort: 3000
                }
            ],
            // type: "LoadBalancer"
            type: "ClusterIP"
        }
    };

    const response = await k8sApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    });

    console.log("Service created successfully:");
    console.log(response);
}

/** True when the Kubernetes API rejected the request because the object is gone. */
function isNotFound(error: unknown) {
    return (error as { code?: number })?.code === 404
}

/**
 * Deletes a preview pod, treating an already-deleted pod as success.
 *
 * @param podName Name of the pod in the `default` namespace.
 */
export async function deletePod(podName: string) {
    try {
        await k8sApi.deleteNamespacedPod({ namespace: "default", name: podName })
        console.log(`Pod ${podName} deleted`)
    } catch (error) {
        if (isNotFound(error)) return
        throw error
    }
}

/**
 * Deletes a preview service, treating an already-deleted service as success.
 *
 * @param serviceName Name of the service in the `default` namespace.
 */
export async function deleteService(serviceName: string) {
    try {
        await k8sApi.deleteNamespacedService({ namespace: "default", name: serviceName })
        console.log(`Service ${serviceName} deleted`)
    } catch (error) {
        if (isNotFound(error)) return
        throw error
    }
}