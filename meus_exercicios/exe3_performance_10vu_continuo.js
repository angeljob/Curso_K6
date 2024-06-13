import http from 'k6/http';
import { check, sleep  } from 'k6';

/*Escopo do teste é realizar o registro de um novo usuário:
Critérios
1 carga de 10 vu por 10 segundos
2 requisições com sucesso 95%
3 requisições com falha < 1%
4 duração da requisição p(95) < 500 ms */

export const options = {
    stages: [{ duration: '30s', target: 10}],  //1 carga de 10 vu por 10 segundos
    thresholds: {
        checks: ['rate > 0.95'], // Requisições com sucesso 95%
        http_req_failed: ['rate < 0.01'], // Requisições com falha < 1%
        http_req_duration: ['p(95) < 30000'] // Duração da requisição p(95) < 500 ms       
    }
}

export default function(){
    const USER = `${Math.random()}@mail.com`
    const PASS = 'user123'
    const BASE_URL = 'https://test-api.k6.io/';
    console.log( USER + PASS);

    const res = http.post(`${BASE_URL}user/register/`,{
        username: USER,
        first_name: 'crocodilo',
        last_name: 'dino',
        email: USER,
        password: PASS
    });
    check(res, {
        'sucesso ao registrar': (r) => r.status === 201
    });
    sleep(1)
}

