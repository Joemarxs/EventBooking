import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,          // One virtual user
  iterations: 1,   // Run only once
};

export default function () {
  const url = 'http://localhost:8083/api/payments'; // Removed ID

  const res = http.get(url);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response contains payment info': (r) =>
      r.body.includes('amount') || r.body.includes('method'),
  });
}
