import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 50,              // 50 virtual users
  duration: '30s',      // run test for 30 seconds
};

export default function () {
  const res = http.get('http://localhost:8083/api/events/'); 

  check(res, {
    'status is 200': (r) => r.status === 200,
    'body is not empty': (r) => r.body && r.body.length > 0,
  });

  sleep(1); 
}
