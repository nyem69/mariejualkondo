<script>

  export let data;

  // console.log('data', data);

  import * as d3 from 'd3';
	import * as turf from '@turf/turf';
  import moment from 'moment';

  let z2 = d3.format('02d'),
      comma = d3.format(',');



  const klcc = [101.7116455, 3.1574917];
  const geojson_klcc = turf.point(klcc);

  let filterLabels = {
    _distance_from_klcc: 'Distance from KLCC',
    _price: 'Price',
    _price_psf2: 'Price per sf',
    _size: 'Size',
    _room: 'Rooms',
    _completion_date: 'Completion Date',
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
        p._lonlat = p._latlon.reverse();
        p._distance_from_klcc = turf.distance(geojson_klcc, turf.point(p._lonlat));
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
      // room
      //--------------------------
      p._room  = d['Rooms'];
      p._room = p._room.replace(/\(.*?\)/,'').trim();
      p._room = p._room.replace(/\s+\d+bathtub/i,'').trim();
      p._room = p._room.replace(/\s+/g,'').trim();
      p._room = p._room.replace(/R\+/,'R').trim();

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
          pr = pr.replace(/K/i,'000')
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
        if (p._completion.quarter==1){
          p._completion_date = p._completion.year +'-01-01';
        }else if (p._completion.quarter==2){
          p._completion_date = p._completion.year +'-04-01';
        }else if (p._completion.quarter==3){
          p._completion_date = p._completion.year +'-07-01';
        }else if (p._completion.quarter==4){
          p._completion_date = p._completion.year +'-10-01';
        }else {
          p._completion_date = p._completion.year +'-07-01';
        }

      }else {
        let c2 = p['Completion'].match(/(\d+)/);
        if (c2) {
          p._completion = {
            year : +c2[1],
          }
          p._completion_date = p._completion.year +'-07-01';
        }
      }


      rows.push(p);
    }

    // d['Size B'].split(/\n/).forEach(j=>{
    //   let p = {...k};
    //   p['Size B'] = j;
    // });



  })

  // console.log('rows', rows);

  rows.forEach((d,i)=>{
    d.active = true;
    d._index = i+1;
  })





  import { M } from "$lib/Store.js";


  import Panel_Maplibre from '$lib/panels/Panel_Maplibre.svelte';

  import Panel_Mapbox from '$lib/panels/Panel_Mapbox.svelte';
  import Panel_Beeswarms from '$lib/panels/Panel_Beeswarms.svelte';
  import Panel_Beeswarms_Scaleband from '$lib/panels/Panel_Beeswarms_Scaleband.svelte';
  import Panel_Beeswarms_Timeline from '$lib/panels/Panel_Beeswarms_Timeline.svelte';
  import Panel_Table from '$lib/panels/Panel_Table.svelte';


  import { Button, Popover } from 'flowbite-svelte';






  //---------------------------
  // filters
  //---------------------------

  // $: console.log('$M.filters[_completion_date]', $M.filters['_completion_date']);

  $: rows = rows.map(d=>{
      d.active = true;
      d._fail=[];
      for (let i in $M.filters) {
        if (d.active){
          if (typeof d[i] != 'undefined') {

            if (['_room'].includes(i)) {
              d.active = $M.filters[i].includes(d[i]);
            }else if (['_completion_date'].includes(i)) {
              d.active = +new Date(d[i]) >= +$M.filters[i][0] && +new Date(d[i]) <= +$M.filters[i][1];
            }else {
              d.active = d[i] >= $M.filters[i][0] && d[i] <= $M.filters[i][1];
            }

            if (!d.active)  d._fail.push(i) ;

          }
        }
      }
      return d;
    })

  $: tableRows = rows.filter(d=>d.active);




  // $: console.log('rows', rows.length);
  // $: console.log('tableRows', tableRows.length);

  // $: console.log('missing rows', rows.filter(k=> !(tableRows.find(j=>j._index==k._index)) ));

  // $: console.log('$M.filters', Object.entries($M.filters) )

  //---------------------------
  // icons
  //---------------------------


  let CloseIcon = `<svg class="mr-2 w-6 h-6 text-slate-100 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
          </svg>`;

</script>



<svelte:head>
    <link type="text/css" rel="stylesheet" href="https://libjs.pages.dev/font/b612/b612.css"/>
</svelte:head>




<style>

  p {
    padding:3px;
  }
</style>

<div class="sm:m-0 md:m-8 lg:m-12 xl:m-16 w-full" style="min-height:3000px">

    <div class="m-4">

    <h1 class="font-semibold text-3xl mb-4">Klang Valley Residential Property Overview</h1>

    <div class="flex flex-wrap">

      <div class="flex-1">

        <p>
            Dive into an in-depth analysis of residential properties currently on sale in Klang Valley.
        </p>
        <p>
            This multifaceted visualization spans from pinpointing geographical locations on the Location Map to various pricing metrics. The <span id="beeswarm_plot" class="underline text-[#4285F4]">beeswarm plots</span> elucidate factors such as distance from KLCC, pricing patterns, square footage, and number of rooms. Additionally, an anticipated completion date offers foresight into the project finalization timeline.
        </p>
        <p>
            Leveraging this tool, both potential buyers and real estate aficionados can grasp Klang Valley's property market landscape, fostering informed decisions and foresight about prevailing and imminent trends.
        </p>

        <p>
          Data source : <a class="underline text-[#4285F4]" href="https://twitter.com/natashagideon?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1711657563388035117%7Ctwgr%5Ef03ef67400a9fdb9b3b63ca16c89128eec6ee6cf%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A5173%2F" target="_blank">MarieJualKondo</a>.
        </p>

      </div>


    </div>
  </div>

  <!--
    filters
  -->
  <div class="flex flex-wrap gap-1 m-4 min-h-[50px]">
    {#each Object.entries($M.filters) as d}

      {#if ['_room'].includes(d[0])}

        {#if $M.defaultState[d[0]].join('-')!=d[1].join('-')}
          <Button class="bg-[#E485A5]"
            on:click={()=>{
              $M.filters[d[0]] = $M.defaultState[d[0]];
            }}
          >
            {@html CloseIcon}
            { filterLabels[d[0]] ? filterLabels[d[0]] : d[0].split('_').filter(d=>d).join(' ')} :
            { d[1].join(', ') }
          </Button>
        {/if}

      {:else if ['_completion_date'].includes(d[0])}

        {#if $M.defaultState[d[0]].join('-')!=d[1].join('-')}
          <Button class="bg-[#E485A5]"
            on:click={()=>{
              $M.filters[d[0]] = $M.defaultState[d[0]];
            }}
          >
            {@html CloseIcon}
            { filterLabels[d[0]] ? filterLabels[d[0]] : d[0].split('_').filter(d=>d).join(' ')} :
            { d[1].map(d=>moment(d).format('YYYY')+' Q'+moment(d).format('Q')).join(' - ') }
          </Button>
        {/if}

      {:else}
        {#if d[1][0]!=$M.defaultState[d[0]][0] || d[1][1]!=$M.defaultState[d[0]][1]}
          <Button class="bg-[#E485A5]"
            on:click={()=>{
              $M.filters[d[0]] = $M.defaultState[d[0]];
            }}
          >
            {@html CloseIcon}
            { filterLabels[d[0]] ? filterLabels[d[0]] : d[0].split('_').filter(d=>d).join(' ')} :
            <span class="min-w-[60px] ml-1 mr-1 text-right">{ comma(Math.floor(d[1][0])) }</span> ~
            <span class="min-w-[60px] ml-1 mr-1 text-left">{ comma(Math.ceil(d[1][1])) }</span>
          </Button>
        {/if}
      {/if}
    {/each}
  </div>



  <div class="flex flex-wrap-reverse">

    <div class="flex-1 max-w-2xl">




      <!--
        map
      -->



      <div>
        <div class="flex">
          <div class="flex-1 font-semibold text-sm text-left pl-8">Location Map</div>
        </div>
        <!-- <Panel_Maplibre {data}/> -->
        <Panel_Mapbox {tableRows} {klcc} {geojson_klcc}/>
        <div class="text-xs mt-2 mb-4">The map displays approximate locations of selected residential housing projects currently under development. Please note that the positions are estimated and for reference purposes only. Actual locations may vary</div>
      </div>





      <!--
        table listing
      -->
      <div class="w-full max-h-[70vh] sm:overflow-x-hidden">
        <Panel_Table {tableRows}/>
      </div>

    </div>




    <!--
      beeswarm brush
    -->
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

          <Panel_Beeswarms_Scaleband
            title={"Rooms"}
            key={'_room'}
            xAxisLabel={"Rooms"}
            sortOrder={[
              "",
              "Studio",
              "1+1R1B",
              "1R1B",
              "2R",
              "2R1B",
              "2R2B",
              "2+1R2B",
              "3R2B",
              "3R12B",
              "3R2+1B",
              "3+1R2B",
              "4R2B",
              "4R3B",
              "4R4B",
              "4+1R&5+1B",
              "5R6B"
            ]}
            {rows}
            {tableRows}/>




          <Panel_Beeswarms_Timeline
            title={"Completion Date"}
            key={'_completion_date'}
            xAxisLabel={"Date"}
            {rows}
            {tableRows}/>

      </div>



    </div>



  </div>


  <div>
    {#each rows as d}
      <Popover triggeredBy=".node-{d._index}" offset="30" class="text-sm font-light m-4 {d.active?'bg-[#E485A5] text-white':'bg-slate-50'}" defaultClass="">
        <div class="m-4 ">
          <table>
            <tr><td class="opacity-50 pr-2">Project</td><td>{d['Project']||''}</td></tr>
            <tr><td class="opacity-50 pr-2">Location</td><td>{d['Location']||''}</td></tr>
            <tr><td class="opacity-50 pr-2">Rooms</td><td>{d['Rooms']||''}</td></tr>
            <tr><td class="opacity-50 pr-2">Size</td><td>{d['Size']||''}</td></tr>
            {#if d['Rooms Remarks']}
              <tr><td class="opacity-50 pr-2">Remarks</td><td>{d['Rooms Remarks']||''}</td></tr>
            {/if}
            <tr><td class="opacity-50 pr-2">Price</td><td>{d['Price']||''}</td></tr>
            <tr><td class="opacity-50 pr-2">Completion</td><td>{d['Completion']||''}</td></tr>
            <!-- {#if d['Link_URL']}
              <tr><td class="opacity-50 pr-2">Enquire</td><td><a href="{d['Link_URL']}" target="_blank">{d['Link']||''}</a></td></tr>
            {/if} -->
          </table>

        </div>
      </Popover>
    {/each}



      <Popover triggeredBy="#beeswarm_plot" offset="10" class="max-w-[400px] text-sm font-light m-4" defaultClass="">
        <div class="m-4 ">

          <p>
          A beeswarm plot conveys the size of a group of items by visually clustering each individual data point.
          </p>
          <p>
          It is a type of scatter plot that organizes and displays individual data points in a way that they do not overlap.
          This ensures that each point is visible, which can be especially valuable when dealing with dense datasets.
          </p>
          <p>
          Points are typically organized along a single axis, allowing them to 'swarm' around a particular value, much like bees around a hive.
          </p>
          <p>
          By preventing overlap, the beeswarm plot provides a clear view of the distribution and concentration of data, making it an effective tool for identifying patterns and anomalies in the dataset.
          </p>
          <p>
          Hover over any individual point representing a type of property to see a more detail info of that unit type.

          </p>

        </div>
      </Popover>


  </div>





<!--
      <div class="flex-1 mt-20">
        <div class="mt-4">
            This visualization was inspired by a tweet from <a class="underline text-[#4285F4]" href="https://twitter.com/natashagideon?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1711657563388035117%7Ctwgr%5Ef03ef67400a9fdb9b3b63ca16c89128eec6ee6cf%7Ctwcon%5Es1_&ref_url=http%3A%2F%2Flocalhost%3A5173%2F" target="_blank">MarieJualKondo</a>. She shared her Excel sheet of property listings. While advising on Excel isn't my forte, the data within those sheets provided an insightful window into Klang Valley's property market, making it ripe for this visualization exercise.
        </div>
        <div class="mt-4">
          <blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hi semua, nak minta feedback on my project excel sheet. <br><br>Just FYI some things we are prohibited to share, that&#39;s why some cannot disclose name, developer etc. I kena ikut rules each developer.<br><br>*First page belum update. <a href="https://t.co/SIICVnUE13">https://t.co/SIICVnUE13</a></p>&mdash; MarieJualKondo 🇲🇾🌺 (@natashagideon) <a href="https://twitter.com/natashagideon/status/1711657563388035117?ref_src=twsrc%5Etfw">October 10, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
        </div>
      </div>
 -->


</div>
