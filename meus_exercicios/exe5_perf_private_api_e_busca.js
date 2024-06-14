import http from 'k6/http';
import { check, sleep } from 'k6';

/*Cenario
Private api:
    Buscando todos os crocodilos
Critérios:
    Performance test:
        100 vu por 10s
    Limites:
        Requisição com falha inferior a 1% 
        Duração da requisição 95% levam menos de 6 seg*/

export const options = {
    vus: 100,
    duration: '10s',
    thresholds: {
        http_req_failed: ['rate < 0.01'],
        http_req_duration: ['p(95) < 6000']
    }
}

const BASE_URL = 'https://test-api.k6.io';

export function setup(){
    const loginRes = http.post(`${BASE_URL}/auth/token/login/`, {
        username: '0.5577608357004727@mail.com',
        password: 'user123'
    });
    const token = loginRes.json('access');
    return token;
}
export default function(token){
    const params = {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
    const res = http.get(`${BASE_URL}/my/crocodiles`, params);
    check(res, {
        'status code 200': (r) => r.status === 200
    });
}