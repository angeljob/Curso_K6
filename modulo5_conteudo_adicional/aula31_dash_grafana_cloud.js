import http from 'k6/http';
import {sleep, check} from 'k6';

export const options = {
    stages: [
        { duration: '30s', target: 10 }, 
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 } 
    ],
    thresholds: {
        checks: ['rate > 0.95'],
        http_req_duration: ['p(95) < 3000']
    },
    //para executar no grafana cloud add as 2 lihas abaixo:
    ext:{
        loadimpact:{
            projectID: '3701296',
            name: 'POC CURSO K6'
        }
    }
}

export default function(){

    const BASE_URL = 'https://test-api.k6.io/public/crocodiles';
    const res = http.get(BASE_URL)
    
    check(res,{
        'status 200': (r) => r.status === 200
    });
    sleep(1);
}

/* Execução na gloud grafana:
Alterar acina em o parametro loadimpact.projectID
Id projeto grafana:3701296
Token grafana: c0472183b707b91ad8ef880ef46586eda017e09d4341b9e3af63e21f8c9d9509


Comando de execução na cli powershel:
k6 login cloud --token c0472183b707b91ad8ef880ef46586eda017e09d4341b9e3af63e21f8c9d9509
k6 cloud aula31_dash_grafana.js



*/