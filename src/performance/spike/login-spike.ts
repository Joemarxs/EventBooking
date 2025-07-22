import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:8083'; // Adjust the port if necessary

export const options = {
    stages: [
        { duration: '30s', target: 20 },   // ramp-up to 20 users
        { duration: '30s', target: 100 },  // ramp-up to 100 users
        { duration: '30s', target: 200 },  // ramp-up to 200 users
        { duration: '1m', target: 300 },   // spike to 300 users
        { duration: '30s', target: 0 },    // ramp-down to 0 users
    ],
    ext: {
        loadimpact: {
            name: 'Login Spike Test',
        },
    },
};

export default function () {
    const payload = JSON.stringify({
        email: 'chris@example.com',
        password: '123',
    });

    const headers = {
        'Content-Type': 'application/json',
    };

    const res = http.post(`${BASE_URL}/api/auth/login`, payload, { headers });

    check(res, {
        'status is 200': (r) => r.status === 200,
        'response has token': (r) => {
            try {
                const json = JSON.parse(r.body as string);
                return !!json.token;
            } catch {
                return false;
            }
        },
    });

    sleep(1);
}
