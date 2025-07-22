import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8083'; 

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // ramp-up to 20 users
        { duration: '30s', target: 100 },  // ramp-up to 100 users
        { duration: '30s', target: 0 },    // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'GET /api/events/ Spike Test',
        },
    },
};

export default function () {
    const res = http.get(`${BASE_URL}/api/events/`, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'body is not empty': (r) => r.body && r.body.length > 0,
    });

    sleep(1); // Simulate user think time
}
