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
                   image: "nextjs:latest",
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
            type: "LoadBalancer"
        }
    };

    const response = await k8sApi.createNamespacedService({
        namespace: "default",
        body: serviceManifest
    });

    console.log("Service created successfully:");
    console.log(response);
}