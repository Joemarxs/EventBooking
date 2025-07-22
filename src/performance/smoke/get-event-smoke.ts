import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,          // 1 virtual user
  iterations: 1,   // Run only once
};

export default function () {
  const url = 'http://localhost:8083/api/events'; 

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'returns JSON': (r) => r.headers['Content-Type'].includes('application/json'),
    'contains events': (r) => r.body.includes('title') || r.body.includes('name'),
  });
}
