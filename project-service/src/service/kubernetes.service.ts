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

export async function waitForPodReady(podName: string, timeoutMs = 120000){
    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
        const response = await k8sApi.readNamespacedPodStatus({
            name: podName,
            namespace: "default"
        });

        const isReady = response.status?.conditions?.some(
            condition => condition.type === "Ready" && condition.status === "True"
        );

        if (isReady) {
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    throw new Error(`Timed out waiting for pod ${podName} to become ready`);
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
