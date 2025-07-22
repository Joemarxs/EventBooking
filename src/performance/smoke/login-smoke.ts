import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 1,         // One virtual user
  iterations: 1,  // Run once
};

export default function () {
  const url = 'http://localhost:8083/api/users/login';
  const payload = JSON.stringify({
    email: 'chris@example.com',
    password: '123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body contains token': (r) => r.body.includes('token'),
  });
}
