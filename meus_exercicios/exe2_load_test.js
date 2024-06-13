import http from 'k6/http';
import {sleep, check} from 'k6';
import { SharedArray } from 'k6/data';

export const options = {
    stages: [
        { duration: '10s', target: 10 }, //ramp-up --> subida de usuários.
        { duration: '10s', target: 10 }, // fase de carga, ou seja mantem um número cosntante de usuários.
        { duration: '10s', target: 0 }  // fase de desaceleração.
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 9500']
    }
}

const data = new SharedArray('Lendo um json para pegar dados de massa', function(){
    return JSON.parse(open('./arquivos/dados_crocodilos.json')).crocodilos
});

export default function(){
    const crocodilo = data[Math.floor(Math.random() * data.length)].id
    console.log(crocodilo);
    const BASE_URL = `https://test-api.k6.io/public/crocodiles/${crocodilo}`;
    const res = http.get(BASE_URL)
    check(res,{
        'status code é 200?': (r) => r.status === 200
    });
    sleep(1)
}