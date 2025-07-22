import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8083'; // Change if your server runs elsewhere

export const options = {
    stages: [
        { duration: '1m', target: 100 },  // ramp to 100 users
        { duration: '30s', target: 0 },   // ramp down
    ],
    ext: {
        loadimpact: {
            name: 'GET Events Stress Test',
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
