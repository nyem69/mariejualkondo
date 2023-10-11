
import * as d3 from 'd3';


/** @type {import('./$types').LayoutServerLoad} */
export async function load() {

    let data = {
        errors:[]
    };

    await d3.csv('https://docs.google.com/spreadsheets/d/e/2PACX-1vRV7Ueb_fE9y9s1shjs5_QcrlLyvhIq6HC-vzqgIibNr17pvt_xSpJPyaM3a-9iaKOExjqqbfNYxRBC/pub?gid=546665090&single=true&output=csv')
        .then(res=>{

            console.log('res', res);
            data.raw = res;
        })
        .catch(e=>{

            console.warn(e);
            data.errors.push('gsheet load error')

        })

    return data;
}
