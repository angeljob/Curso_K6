import http from 'k6/http';
import { check, sleep } from 'k6';



export const options = {
    vus: 15,
    duration: '60s',
    thresholds: {
        checks: ['rate > 0.99']
    }
}

export default function(){
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/';
    const res = http.get(BASE_URL);
    check(res, {
        'status code 200': (r) => r.status === 200
    });
    sleep(1);
}

/*
Executar no gitbash:
Comando execução com relatorio salvo: K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=relatorio.html k6 run aula30_dash_core_k6.js
Comando execução com relatorio em tempo real:K6_WEB_DASHBOARD=true  k6 run aula30_dash_core_k6.js
Para ver acessar: http://localhost:5665/

Executar no prompt: 
set K6_WEB_DASHBOARD=true
set K6_WEB_DASHBOARD_EXPORT=relatorio.html
k6 run aula30_dash_core_k6.js

Executar no powershell: 
$env:K6_WEB_DASHBOARD = "true"
$env:K6_WEB_DASHBOARD_EXPORT = "relatorio.html"
k6 run .\aula30_dash_core_k6.js

*/



