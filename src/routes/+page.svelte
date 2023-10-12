<script>

  export let data;

  console.log('data', data);

  import * as d3 from 'd3';
	import * as turf from '@turf/turf';
  import * as numeral from 'numeral';

  let comma = d3.format(','),
      f1 = d3.format('.1f'),
      f2 = d3.format('.2f'),
      f3 = d3.format('.3f');

  const klcc = [101.7116455, 3.1574917];
  const geojson_klcc = turf.point(klcc);

  let filterLabels = {
    _distance_from_klcc: 'Distance from KLCC',
    _price: 'Price',
    _price_psf2: 'Price per sf',
    _size: 'Size',
  };


  let rows=[];

  data.raw.forEach(d=>{

    if (d['Size B'] && !d['Size B'].match(/\w+/)) d['Size B'] = '' + d['Size'];
    if (d['Rooms B'] && !d['Rooms B'].match(/\w+/)) d['Rooms B'] = '' + d['Rooms'];
    if (d['Price B'] && !d['Price B'].match(/\w+/)) d['Price B'] = '' + d['Price'];
    if (d['Title B'] && !d['Title B'].match(/\w+/)) d['Title B'] = '' + d['Title'];



    let sizes = d['Size B'].split(/\n/);
    let rooms = d['Rooms B'].split(/\n/);
    let prices = d['Price B'].split(/\n/);
    let status = d['Status B'].split(/\n/);
    let titles = d['Title B'].split(/\n/);
    let remarks = d['Rooms remarks'].split(/\n/);


    let k = {...d};

    for (let i=0;i<sizes.length-1;i++) {
      let p = {...k};


      delete p['Size B'];
      delete p['Rooms B'];
      // delete p['Price B'];
      delete p['Title B'];
      delete p['Status B'];

      delete p['Rooms remarks'];
      delete p['Size'];
      delete p['Rooms'];
      // delete p['Price'];
      delete p['Title'];

      p['Size'] = sizes[i] || null;
      p['Rooms'] = rooms[i] || null;
      p['Price C'] = prices[i] || null;
      p['Status'] = status[i] || null;
      p['Title'] = titles[i] || null;
      p['Room Remarks'] = remarks[i] || null;


      //--------------------------
      // _latlon
      //--------------------------
      if (p['Coords']){

        p._latlon = p['Coords'].split(/\s*,\s*/).map(d=>+d);
        p._distance_from_klcc = turf.distance(geojson_klcc, turf.point([p._latlon[1],p._latlon[0]]));

      }

      delete p['Coords'];

      //--------------------------
      // _size, _dimension
      //--------------------------
      let dim = (p['Size']||'').match(/(\d+\,*\d+)\s*sf\s*\((.*?)\)/);
      if (dim){
        p._size = +dim[1].replace(/\,/g,'');
        p._dimension = dim[2];
      }else {
        let dim3 = (p['Size']||'').match(/(\d+\,*\d+)\s*\((.*?)\)/);
        if (dim3){
          p._size = +dim3[1].replace(/\,/g,'');
          p._dimension = dim3[2];
        }else {
          let dim2 = (p['Size']||'').match(/(\d+\,*\d+)\s*sf/);
          if (dim2){
            p._size = +dim2[1].replace(/\,/g,'');
          }
        }

      }

      //--------------------------
      // Price
      //--------------------------
      if (d["Price"].match(/\d+/)){
        let pr = d['Price'];
        pr = pr.replace(/From/i,'');
        pr = pr.replace('RM','')

        let mil = pr.match(/(\d+\.*\d*)\s*Mil/i);
        if (mil) {

          let v = +mil[1] * 1000000;
          p._price = v;

        }else {
          pr = pr.replace('***k','000000')
          pr = pr.replace('***k','000000')
          pr = pr.replace('**k','00000')
          pr = pr.replace('xxxk','000000')
          pr = pr.replace('xxk','00000')
          pr = pr.replace('k','000')
          pr = pr.replace('xx','00')
          pr = pr.replace(/\,/g,'')
          pr = pr.replace('\s+','').trim();



          if (pr.match(/^\d+$/)){
            p._price = +pr;
          }else {
            p._price = pr;
          }

        }

      }

      // let pr = (d['Price']||'').match(/(\d+\,*\d*)/);
      // if (pr) {
      //   p._price = +pr[1];
      // }

      //--------------------------
      // Price psf
      //--------------------------
      let psf = (d['Price psf']||'').match(/(\d+\,*\d*)/);
      if (psf) {
        p._price_psf = +psf[1];
      }



      //--------------------------
      // _price_psf2
      //--------------------------
      if (p._price && p._size) {
        p._price_psf2 = Math.ceil(p._price / p._size);
      }


      //--------------------------
      // _price_from_psf
      //--------------------------
      if (p._price_psf && p._size) {
        p._price_from_psf = p._price_psf * p._size;
      }


      //--------------------------
      // _completion
      //--------------------------
      let completion = p['Completion'].match(/(\d+) Q(\d+)/);
      if (completion) {
        p._completion = {
          year : +completion[1],
          quarter: +completion[2],
        }
      }else {
        let c2 = p['Completion'].match(/(\d+)/);
        if (c2) {
          p._completion = {
            year : +c2[1],
          }
        }
      }


      rows.push(p);
    }

    // d['Size B'].split(/\n/).forEach(j=>{
    //   let p = {...k};
    //   p['Size B'] = j;
    // });



  })

  console.log('rows', rows);

  rows.forEach((d,i)=>{
    d.active = true;
    d._index = i+1;
  })



  import { M } from "$lib/Store.js";


  import Panel_Maplibre from '$lib/panels/Panel_Maplibre.svelte';
  import Panel_Beeswarms from '$lib/panels/Panel_Beeswarms.svelte';


  import { Alert, Button, Badge } from 'flowbite-svelte';


  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';






  //---------------------------
  // filters
  //---------------------------

  $: console.log('$M.filters', $M.filters)

  // function _filter(d) {
  //   let tf = true;
  //   for (let i in $M.filters) {
  //     if (tf){
  //       tf = d[i] >= $M.filters[i][0] && d[i] <= $M.filters[i][1];
  //     }
  //   }
  //   return tf;
  // }

  $: rows = rows.map(d=>{
      // d.active = _filter(d);
      d.active = true;
      for (let i in $M.filters) {
        if (d.active){
          d.active = d[i] >= $M.filters[i][0] && d[i] <= $M.filters[i][1];
        }
      }

      return d;

      // console.log(d._index, d.active)
    })

  $: tableRows = rows.filter(d=>d.active);

  $: console.log('tableRows.length', tableRows.length)



</script>





<div class="flex flex-wrap gap-1 m-4 min-h-[50px]">
  {#each Object.entries($M.filters) as d}
    {#if d[1][0]!=$M.defaultState[d[0]][0] || d[1][1]!=$M.defaultState[d[0]][1]}
      <Button color="light">
        { filterLabels[d[0]] ? filterLabels[d[0]] : d[0].split('_').filter(d=>d).join(' ')} :
        { Math.floor(d[1][0]) } -
        { Math.ceil(d[1][1]) }
      </Button>
    {/if}
  {/each}
</div>



<div class="flex m-4 flex-wrap-reverse">

  <div class="flex-1 max-w-2xl">
    <div>
      <Panel_Maplibre {data}/>
    </div>


    <div>

      <Table class="min-h-[1000px]">
        <TableHead>
          <TableHeadCell>Project</TableHeadCell>
          <TableHeadCell>Location</TableHeadCell>
          <TableHeadCell>Rooms</TableHeadCell>
          <TableHeadCell>Size</TableHeadCell>
          <TableHeadCell>Size (sf)</TableHeadCell>
          <TableHeadCell>Dimension</TableHeadCell>
          <TableHeadCell>Remarks</TableHeadCell>
          <TableHeadCell>Price</TableHeadCell>
          <TableHeadCell>Price</TableHeadCell>
          <TableHeadCell>Price (psf x size) </TableHeadCell>
          <TableHeadCell>Price (psf)</TableHeadCell>
          <TableHeadCell>Price (psf)</TableHeadCell>
          <TableHeadCell>Distace from KLCC (km)</TableHeadCell>
        </TableHead>
        <TableBody>
          {#each tableRows as d}
            <TableBodyRow>
              <TableBodyCell>{d['Project']||''}</TableBodyCell>
              <TableBodyCell>{d['Location']||''}</TableBodyCell>
              <TableBodyCell>{d['Rooms']||''}</TableBodyCell>
              <TableBodyCell>{d['Size']||''}</TableBodyCell>
              <TableBodyCell>{d['_size']||''}</TableBodyCell>
              <TableBodyCell>{d['_dimension']||''}</TableBodyCell>
              <TableBodyCell>{d['Rooms Remarks']||''}</TableBodyCell>
              <TableBodyCell>{d['Price']||''}</TableBodyCell>
              <TableBodyCell>{
                d['_price'] ? d['_price'] : ''
              }</TableBodyCell>
              <TableBodyCell>{
                d['_price_from_psf'] ? d['_price_from_psf'] : ''
              }</TableBodyCell>

              <TableBodyCell>{d['_price_psf']||''}</TableBodyCell>
              <TableBodyCell>{d['_price_psf2']||''}</TableBodyCell>
              <TableBodyCell class="text-right">{d['_distance_from_klcc'] ? f1(d['_distance_from_klcc'])+'km' : ''}</TableBodyCell>
            </TableBodyRow>
          {/each}
        </TableBody>
      </Table>
    </div>

  </div>

  <div class="flex-1">

    <div class="flex justify-center items-stretch flex-wrap" style="flex-wrap:wrap;">

        <Panel_Beeswarms
          title={"Distance from KLCC"}
          key={'_distance_from_klcc'}
          xAxisLabel={"Distance (KM)"}
          {rows}
          {tableRows}/>

        <Panel_Beeswarms
          title={"Price"}
          key={'_price'}
          xAxisLabel={"Price (RM)"}
          {rows}
          {tableRows}/>

        <Panel_Beeswarms
          title={"Price Per Square Feet"}
          key={'_price_psf2'}
          xAxisLabel={"Price Per Square Feet (RM)"}
          {rows}
          {tableRows}/>

        <Panel_Beeswarms
          title={"Size (Square Feet)"}
          key={'_size'}
          xAxisLabel={"Size(SqFt)"}
          {rows}
          {tableRows}/>

    </div>



  </div>



</div>
