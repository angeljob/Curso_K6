import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

/*Critérios:
    1 Realizar a consulta a api de listagem de crocodilos e busca por id de crocodilos.
    2 É esperado um RPS de 200 REQ/S para a api de listagem de crocodilos por 20 segundos.
    3 Para busca por id, o sistema deve atender 50 usuários onde 
    cada usuário realiza até 20 solicitações em até 1 min.
        * Usuários par devem efetuar a busca ao crocodilo de ID 2.
        * Usuários impar devem efetuar a busca ao crocodilo de ID 1.
    4 Ambos os testes devem ser executados simultaneamente.*/

    export const options = {
        scenarios:{
            listar: {
                executor: 'constant-arrival-rate',
                exec: 'listar',
                duration: '30s',
                rate: 200,
                timeUnit: '1s',
                preAllocatedVUs: 150,
                gracefulStop: '5s',
                tags: { test_type: 'listagem_crocodilos' },
    
            },
            buscar: {
                executor: 'per-vu-iterations',
                exec: 'buscar',
                vus: 50,
                iterations: 20,
                maxDuration: '1m',
                tags: { test_type: 'busca_crocodilos' },
                gracefulStop: '5s'
            }
        },
        discardResponseBodies: true
    }
    
    export function listar(){
        http.get(__ENV.URL+'/crocodiles')
    };
    
    export function buscar(){
        if(__VU % 2 === 0){
            http.get(__ENV.URL+'/crocodiles/2')
        }else{
            http.get(__ENV.URL+'/crocodiles/1')
        }
    };

    // export function handleSummary(data) {
    //     return {
    //       "teste_k6.html": htmlReport(data),
    //     };
    //   }
    
//comando executar: k6 run .\exe6_carga_perf_2_apis.js -e URL=https://test-api.k6.io/public


/*import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 100,
    duration: '1m',
    thresholds: {
        http_req_failed: ['rate < 0.05'],
    }
}

export default function(){
    const BASE_URL = 'https://test-api.k6.io/public/crocodiles/';

    const res = http.get(BASE_URL);

    check(res, {
        'status code 200': (r) => r.status === 200
    });
}*/
