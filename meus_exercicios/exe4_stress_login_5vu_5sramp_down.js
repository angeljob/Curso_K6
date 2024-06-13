import http from 'k6/http';
import { check, sleep } from 'k6';
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

/*Cenário Registro e login
    //  Realizar login com novo usuario
Critérios:
    Stress test:
        Ramp up 5 vu em 5s
        Carga 5 vu por 5s
        Ramp up 50 vu em 2s
        Carga de 50 vu em 2s
        Ramp down 0 vu em 5s
    Limites:
        Requisição com falha inferior a 1% */

export const options = {
    stages: [
        { duration: '5s', target: 5 },  //Ramp up 5 vu em 5s
        { duration: '5s', target: 5 },  //Carga 5 vu por 5s
        { duration: '2s', target: 50 }, //Ramp up 50 vu em 2s
        { duration: '2s', target: 50 }, //Carga de 50vu em 2s
        { duration: '5s', target: 0 }   //Ramp down 0 vu em 5s
    ],
    thresholds: {
        http_req_failed: ['rate < 0.01'], // Requisições com falha < 1%
        http_req_duration: ['p(95) < 15000'], // 95% levam menos de 15 segundos
    }
};

const csvData = new SharedArray('Ler dados', function() {
    const data = papaparse.parse(open('../modulo4_mão_na_massa/usuarios.csv'), { header: true }).data;
    console.log('Dados CSV:', data); // Adicione este log
    return data;
});

export default function() {
    const user = csvData[Math.floor(Math.random() * csvData.length)];
    console.log('Usuário selecionado do CSV:', user); // Adicione este log

    if (!user) {
        console.error('Nenhum usuário foi selecionado do CSV.');
        return;
    }

    const USER = user.email;
    const PASS = 'user123';
    const BASE_URL = 'https://test-api.k6.io';

    console.log('Tentando logar com usuário:', USER);

    const res = http.post(`${BASE_URL}/auth/token/login/`, JSON.stringify({
        username: USER,
        password: PASS
    }), {
        headers: { 'Content-Type': 'application/json' }
    });

    const success = check(res, {
        'sucesso no login': (r) => r.status === 200,
        'token gerado': (r) => r.json('access') != '',
        'campo token retornado': (r) => 'access' in r.json() && r.json('access') !== '',
    });

    if (success) {
        console.log('Token: ', res.json('access'));
    } else {
        console.error(`Falha no login: ${res.status} - ${res.body}`);
    }

    sleep(1);
}
