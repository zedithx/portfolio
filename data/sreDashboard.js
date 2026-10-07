export const FAULT_COPY = {
    machine: {
        title: 'Unhealthy storage machine',
        summary: 'A machine is failing. Response time is rising and some replicas are unavailable.',
        recovery: 'Isolating the fault and rebuilding replicas on a replacement.',
    },
    capacity: {
        title: 'Storage capacity pressure',
        summary: 'Storage machines are nearly full. Requests are slowing down.',
        recovery: 'Adding storage capacity and redistributing data.',
    },
    hotspot: {
        title: 'Uneven storage placement',
        summary: 'One machine is carrying too much data and workload. The cluster has spare room.',
        recovery: 'Redistributing replicas and workload to relieve the hotspot.',
    },
};
