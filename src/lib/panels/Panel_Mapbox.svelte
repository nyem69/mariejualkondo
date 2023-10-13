<script>

    export let tableRows;
    export let klcc;
    export let geojson_klcc;



    import * as d3 from 'd3';
    import d3comparator from '$lib/d3comparator.js';

    import * as turf from '@turf/turf';






    //------------------------------
    // mapbox
    //------------------------------


    import {
        PUBLIC_MAPBOX_KEY
    } from '$env/static/public';

    let MAPBOXKEY = d3.shuffle(PUBLIC_MAPBOX_KEY.split(','))[0].toString().trim();


    import mapboxgl from 'mapbox-gl';
    // import 'mapbox-gl/dist/mapbox-gl.css';

    let map;

    //--------------------------------------
    // map
    //--------------------------------------


    import { onMount } from 'svelte';
    import { browser } from '$app/environment';

    onMount(() => {

        if (browser){



            mapboxgl.accessToken = MAPBOXKEY;


            map = new mapboxgl.Map({
                container: 'map',
                center: klcc,
                // zoom: 16.2,
                zoom: 13,
                // pitch: 62,
                pitch: 90,
                bearing: -20,
                // style: 'mapbox://styles/mapbox/standard-beta',
                // style: 'mapbox://styles/mapbox/light-v11',
                hash: true,
                showUserHeading: true
            });

            map.on('style.load', () => {
                // Day", "Dusk", "Dawn", and "Night
                map.setConfigProperty('basemap', 'lightPreset', 'dusk');
                map.setConfigProperty('basemap', 'showPointOfInterestLabels', true);
                map.setConfigProperty('basemap', 'showRoadLabels', false);


                markerLength = addPoints(tableRows);

            });



        }

    });






    //---------------------------------
    // markers
    //---------------------------------


    const markerHeight = 20;
    const markerRadius = 10;
    const linearOffset = 25;
    const popupOffsets = {
        'top': [0, 0],
        'top-left': [0, 0],
        'top-right': [0, 0],
        'bottom': [0, -markerHeight],
        'bottom-left': [linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'bottom-right': [-linearOffset, (markerHeight - markerRadius + linearOffset) * -1],
        'left': [markerRadius, (markerHeight - markerRadius) * -1],
        'right': [-markerRadius, (markerHeight - markerRadius) * -1]
    };



    let markers = {};
    let popups={};


    let markerLength;


    $: markerLength = addPoints(tableRows);




    //---------------------------------
    // addPoints
    //---------------------------------

    function addPoints(rows){

        let dbg=0;
        dbg&&console.group('%c'+'addPoints','color:magenta');

        for (let i in markers){
            markers[i].remove();
        };

        for (let i in popups){
            popups[i].remove();
        };



        if (map && rows) {



          let furthestPoint = null;
          let maxDistance = 0;

          let grp = d3.groups(rows.filter(d=>d._lonlat), d=>d._lonlat.concat([d['Projects'],d['Location']]).join('-'))
                      .map(d=>{
                        d[1].sort(d3comparator().order(d3.ascending, d=>d._index));
                        return d[1][0]
                      });




          grp
            .sort(d3comparator().order(d3.ascending, d=>d._distance_from_klcc))
            .forEach(d=>{



              const distance = turf.distance(geojson_klcc, turf.point(d._lonlat));

              if (distance > maxDistance) {
                  maxDistance = distance;
                  furthestPoint = d._lonlat;
              }

              let popupLabels=[];
              if (d['Project']) {
                popupLabels.push(d['Project'])
              }else if (d['Location']) {
                popupLabels.push(d['Location']);
              }

              popups[ d._index ] = new mapboxgl.Popup({
                      offset: popupOffsets,
                      closeOnClick: false,
                      closeOnMove: false,
                      // closeButton: false
                  })
                  .setLngLat(d._lonlat)
                  .setText(popupLabels.join(', '))
                  // .setHTML(`
                  //     <div class="popup max-w-[200px] text-black bg-opacity-50 m-0 p-0">
                  //         <div class="flex text-black">
                  //             <div class="flex-1 text-right">`+popupLabels.join(', ')+`</div>
                  //         </div>
                  //     </div>
                  // `)
                  // .addTo(map);


              markers[ d._index ] = new mapboxgl.Marker({
                      color:'magenta',
                      scale:1
                  })
                  .setLngLat(d._lonlat)
                  .addTo(map)
                  .setPopup(popups[ d._index ])




          });


          if (furthestPoint) {
            const bearing = calculateBearing(furthestPoint[0], furthestPoint[1], klcc[0], klcc[1]);
            map
              .setPitch(70)
              .panTo(furthestPoint, { bearing, essential: true , duration:4000});
          }

        }


        // console.log( 'markers', Object.entries(markers).length );


        dbg&&console.groupEnd('addPoints');


        return Object.entries(markers).length;

    }



    function calculateBearing(lon1, lat1, lon2, lat2) {
        const rad = Math.PI / 180;
        const deltaLon = (lon2 - lon1) * rad;
        const lat1Rad = lat1 * rad;
        const lat2Rad = lat2 * rad;
        const y = Math.sin(deltaLon) * Math.cos(lat2Rad);
        const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);
        return (Math.atan2(y, x) / rad + 360) % 360;
    }




</script>



<svelte:head>

  <script src='https://api.mapbox.com/mapbox-gl-js/v3.0.0-beta.1/mapbox-gl.js'></script>
  <link href='https://api.mapbox.com/mapbox-gl-js/v3.0.0-beta.1/mapbox-gl.css' rel='stylesheet' />

</svelte:head>

<!-- <div id="map" class="relative w-full aspect-[9/16] max-h-[70vh] sm:max-h-full sm:aspect-video"></div> -->
<div id="map" class="w-full min-h-[40vh] max-h-[70vh]"></div>
