
import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8083'; // Update if your API runs on a different port

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // ramp-up to 20 users
        { duration: '30s', target: 100 },  // ramp-up to 100 users
        
        { duration: '30s', target: 0 },    // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'Todos GET Stress Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/api/payments`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        
    });

    sleep(1);
}