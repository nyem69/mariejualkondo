<script>



  export let title;
  export let key;
  export let xAxisLabel;
  export let rows;
  export let tableRows;
  export let sortOrder;

  import * as d3 from 'd3';
  import d3comparator from '$lib/d3comparator.js';



  //---------------------------
  // datum
  //---------------------------

  let datum = rows.map(d=>{
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



  let rooms = d3.groups(datum, d=>d[key]).map(d=>{
    return {
      key: d[0],
      values: d[1]
    }
  }).sort(
    sortOrder.length
      ? d3comparator()
          .order(d3.ascending,d=>sortOrder.indexOf(d.key))
      : d3comparator()
          .order(d3.ascending,d=>d.key==''?0:1)
          .order(d3.ascending,d=>d.key=='Studio'?0:1)
          .order(d3.ascending,d=>d.key)
          .order()
  )

  // $: console.log('sortOrder',sortOrder);

  $: filteredRooms = d3.groups(tableRows, d=>d[key]).map(d=>d[0])
      .sort(
        sortOrder.length
          ? d3comparator()
              .order(d3.ascending,d=>sortOrder.indexOf(d))
          : d3comparator()
              .order(d3.ascending,d=>d.key==''?0:1)
              .order(d3.ascending,d=>d.key=='Studio'?0:1)
              .order(d3.ascending,d=>d.key)
              .order()
      );

  // $: console.log('filteredRooms',filteredRooms);


  // let maxRange = rooms.slice(-1).map(d=>d.key);
  $M.defaultState[key] = rooms.map(d=>d.key);

  const xScale = d3.scaleBand(rooms.map(d=>d.key), [0, beewidth]);



  let xAxis = d3.axisBottom(xScale)
                  .ticks(5)
                  .tickSize(beeheight - margin.top - margin.bottom);

  let simulation = d3.forceSimulation(datum)
        .force("x", d3.forceX(d => xScale(d[key])).strength(1))
        .force("y", d3.forceY( (beeheight - margin.bottom - margin.top) / 2))
        .force("collide", d3.forceCollide(5));

  let brush = d3.brushX()
      .extent([
        [0, 0],
        [beewidth, beeheight - 20]
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
          sel.selectAll('text') .attr('fill','#999999')
            // .attr('text-anchor','end')
            .attr('transform','translate(-100,15) rotate(-20)');
          sel.selectAll('.tick line').attr('stroke', '#99999940');
          sel.selectAll('path.domain').attr('stroke', 'none');
        });


    nodes = svg.selectAll('.nodes').data([1])
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


      let ranges = rooms.filter(d=>xScale(d.key) >= event.selection[0] && xScale(d.key) <= event.selection[1] ).map(d=>d.key);

      if (timer) {
        clearTimeout(timer);
        timer=null;
      }
      timer = setTimeout(()=>{
        $M.filters[ key ] = ranges;
      },5);

    }else {
      $M.filters[ key ] = $M.defaultState[key];
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



<div class="Panel_Rooms[{key}] flex-1 mt-4 mb-4" style="min-width:400px; max-heigth:300px;">
  <div class="flex">
    <div class="flex-1 font-semibold text-sm text-left pl-8">{title}</div>
  </div>
  <svg class="w-full" bind:this={el} viewBox="0 0 {beewidth+margin.left+margin.right} {beeheight+margin.top+margin.bottom}">

      <g class="x-axis" transform="translate({margin.left}, {margin.top})" pointer-events="none"></g>

      {#if xAxisLabel}
        <g transform="translate({((beewidth+margin.left)/2)}, {beeheight + margin.top + 5})" pointer-events="none">
          <text text-anchor="middle" class="text-xs fill-[#33333380]">{xAxisLabel}</text>
        </g>
      {/if}

      <g transform="translate({margin.left}, {margin.top})">
        <g class="brush"></g>
        <g class="nodes"></g>
      </g>

  </svg>
  <div class="flex">
    <div class="flex text-xs text-center">{filteredRooms.join(', ')}</div>
  </div>

</div>



