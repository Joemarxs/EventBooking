import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,         // Number of virtual users
  duration: '30s', // Total test duration
};

export default function () {
  const url = 'http://localhost:8083/api/payments';

  const res = http.get(url, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has expected structure': (r) => {
      try {
        const body = JSON.parse(r.body);
        return Array.isArray(body) || Array.isArray(body.data);
      } catch {
        return false;
      }
    },
  });

  sleep(1); // Wait before next iteration
}
