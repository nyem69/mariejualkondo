<script>

  export let title;
  export let key;
  export let xAxisLabel;
  export let rows;
  export let tableRows;

  import * as d3 from 'd3';

  let comma = d3.format(',');


  //---------------------------
  // datum
  //---------------------------

  let datum = rows.filter(d=>d[key] && d[key]>0).map(d=>{
    let k = {...d};
    k.value = d[key];
    return k;
  })


  const beewidth = 500;
  const beeheight = 250;
  const margin = {
          top: 0,
          right: 20,
          bottom: 20,
          left: 40
        };





  let _extent = d3.extent(datum, d=>d.value);
  let minRange = _extent[0];
  let maxRange = _extent[1];

  $M.defaultState[key] = [0,maxRange];

  let xScale = d3.scaleLinear()
        .domain([0,  Math.ceil(maxRange/10)*10])
        .range([margin.left, beewidth - margin.right]);

  let xAxis = d3.axisBottom(xScale)
                  .ticks(5)
                  .tickSize(beeheight - margin.top - margin.bottom);

  let simulation = d3.forceSimulation(datum)
        .force("x", d3.forceX(d => xScale(d[key])).strength(1))
        .force("y", d3.forceY( (beeheight - margin.bottom - margin.top) / 2))
        .force("collide", d3.forceCollide(5));

  let brush = d3.brushX()
      .extent([
        [margin.left, margin.top],
        [beewidth - margin.right, beeheight - margin.bottom]
      ])
      .on("brush end", brushed);


  //====================================================================================
  // onMount
  //====================================================================================

  import { M } from "$lib/Store.js";
  import { onMount } from "svelte";
  // import { browser } from '$app/environment';


  let el;
  let svg;

  let nodes;

  onMount(async () => {

    svg = d3.select(el);

    svg.select('.x-axis')
        .call(xAxis)
        .call(sel=>{
          sel.selectAll('text') .attr('fill','#999999');
          sel.selectAll('.tick line').attr('stroke', '#99999940');
          sel.selectAll('path.domain').attr('stroke', 'none');
        });


    nodes = svg.selectAll('.nodes').data([1])
      .join('g').attr('class','nodes')
        .attr('transform',`translate(0, ${margin.top})`)
            .selectAll(".node").data(datum, d=>d._index)
                .join('circle')
                    .attr("class", d=>'node-'+d._index)
                    .attr("cx", d => d.x)
                    .attr("cy", d => d.y)
                    .attr("r", 4)
                    .attr("fill", d=>d.active ? '#4285F4' : '#99999980')
                    .attr('stroke','#99999980')
                    .attr('cursor','pointer')


      simulation.on("tick", () => {
        nodes
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      });

    svg.select('.brush')
        .call(brush)
        .call(brush.move, null )

  });


  //--------------------------------
  // brushed
  //--------------------------------

  let timer;

  function brushed(event) {
    if (event.selection) {

      let ranges = event.selection.map((d,i) => {
        return i==0 ? Math.floor(xScale.invert(d))
                    : Math.ceil(xScale.invert(d))
      });

      if (timer) {
        clearTimeout(timer);
        timer=null;
      }
      timer = setTimeout(()=>{
        $M.filters[ key ] = ranges;
      },5);

    }else {
      $M.filters[ key ] = [0, maxRange];
    }
  }

  //--------------------------------
  // reactive
  //--------------------------------

  $: nodes && nodes.attr("fill", d=>{
    let k = tableRows.find(k=>k._index==d._index );
    d.active = k && k.active;
    return d.active ? '#E485A5' : "#99999920"
  });



</script>


<!-- <div class="Panel_Beeswarms[{key}] flex-1 mt-4 mb-4" style="min-width:400px; max-heigth:300px;"> -->
<div class="Panel_Beeswarms[{key}] flex-1 min-w-[300px] aspect-[9/16] max-h-[70vh] sm:max-h-full sm:aspect-video mb-8">
  <div class="flex">
    <div class="flex-1 font-semibold text-sm text-left pl-8">{title}</div>
  </div>
  <svg class="w-full" bind:this={el} viewBox="0 0 {beewidth+margin.left+margin.right} {beeheight+margin.top+margin.bottom}">

      <g class="x-axis" transform="translate(0, {margin.top})" pointer-events="none"></g>

      {#if xAxisLabel}
        <g transform="translate({((beewidth+margin.left)/2)}, {beeheight + margin.top + 5})" pointer-events="none">
          <text text-anchor="middle" class="text-xs fill-[#33333380]">{xAxisLabel}</text>
        </g>
      {/if}

      <g class="brush"></g>
      <g class="nodes" transform="translate(0, {margin.top})"></g>
  </svg>


    <div class="text-xs text-center">{$M.filters[key] ? $M.filters[key].map((d,i)=>comma(i==0?Math.floor(d):Math.ceil(d))).join(' ~ ') : ''}</div>

</div>

