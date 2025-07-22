import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3,              // moderate number of virtual users
  duration: '1m',      // extended duration to soak the system
};

export default function () {
  const res = http.get('http://localhost:8083/api/events/');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1); // simulate user think time
}
