import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50, // virtual users
  duration: '30s', // test duration
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
    'is status 200': (r) => r.status === 200,
    'body contains token': (r) => r.body.includes('token'),
  });

  sleep(1);
}
