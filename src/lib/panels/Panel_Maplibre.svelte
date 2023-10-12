<script>
    /** @type {import('./$types').PageData} */
    export let data;


  import { PUBLIC_MAPTILER_KEY } from '$env/static/public';
  import { MapLibre } from 'svelte-maplibre';
  import FillExtrusionLayer from '$lib/maplibre/FillExtrusionLayer.svelte';

  let streetsStyle='https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
  let mapClasses='relative w-full aspect-[9/16] max-h-[70vh] sm:max-h-full sm:aspect-video';


</script>




      <MapLibre
        style={streetsStyle}
        class={mapClasses}
        standardControls
        center={[-74.0066, 40.7135]}
        zoom={15.5}
        pitch={45}
        bearing={-17.6}
        filterLayers={(l) => {
          // Hide the built-in 3D building layer since we're doing our own.
          return l.id !== 'building-3d';
        }}
      >
        <!-- The source and sourceLayer are specific to the map style. You
        will want to look into the style JSON data for your style to see
        the appropriate values. -->
        <FillExtrusionLayer
          source="maptiler_planet"
          sourceLayer="building"
          beforeLayerType={(l) => l.type === 'symbol' && !!l.paint?.['text-color']}
          minzoom={14}
          paint={{
            // Show lower buildings in green, higher in red.
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0,
              '#0a0',
              70,
              '#a00',
            ],

            // use an 'interpolate' expression to add a smooth transition effect to the
            // buildings as the user zooms in
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['get', 'render_height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              14,
              0,
              14.05,
              ['get', 'render_min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          }}
        />
      </MapLibre>

