<script>

  export let tableRows;

  import * as d3 from 'd3';

  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox, TableSearch } from 'flowbite-svelte';

  let comma = d3.format(','),
      f1 = d3.format('.1f'),
      f2 = d3.format('.2f'),
      f3 = d3.format('.3f');

</script>



<Table striped={true}>
  <TableHead>
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Project</TableHeadCell>
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Location</TableHeadCell>
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Rooms</TableHeadCell>
    <!-- <TableHeadCell class="p-1 text-xs">Size</TableHeadCell>
    <TableHeadCell class="p-1 text-xs">Size (sf)</TableHeadCell>
    <TableHeadCell class="p-1 text-xs">Dimension</TableHeadCell> -->
    <!-- <TableHeadCell class="p-1 text-xs">Remarks</TableHeadCell> -->
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Price</TableHeadCell>
    <!-- <TableHeadCell class="p-1 text-xs">Price</TableHeadCell>
    <TableHeadCell class="p-1 text-xs">Price (psf x size) </TableHeadCell>
    <TableHeadCell class="p-1 text-xs">Price (psf)</TableHeadCell> -->
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Price (psf)</TableHeadCell>
    <!-- <TableHeadCell class="p-1 text-xs">Distace from KLCC (km)</TableHeadCell> -->
    <TableHeadCell class="p-1 pt-4 pb-4 text-xs">Completion</TableHeadCell>
  </TableHead>
  <TableBody>
    {#each tableRows as d}
      <TableBodyRow>
        <TableBodyCell class="p-1 text-xs text-normal">{d['Project']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs text-normal">{d['Location']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs text-normal text-center">{d['Rooms']||''}</TableBodyCell>
        <!-- <TableBodyCell class="p-1 text-xs">{d['Size']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs">{d['_size']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs">{d['_dimension']||''}</TableBodyCell> -->
        <!-- <TableBodyCell class="p-1 text-xs">{d['Rooms Remarks']||''}</TableBodyCell> -->
        <TableBodyCell class="p-1 text-xs text-normal text-center">{d['Price']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs text-normal text-center">{d['Price psf']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs text-normal text-center">{d['Completion']||''}</TableBodyCell>



<!--
        <TableBodyCell class="p-1 text-xs">{
          d['_price'] ? d['_price'] : ''
        }</TableBodyCell>
        <TableBodyCell class="p-1 text-xs">{
          d['_price_from_psf'] ? d['_price_from_psf'] : ''
        }</TableBodyCell>

        <TableBodyCell class="p-1 text-xs">{d['_price_psf']||''}</TableBodyCell>
        <TableBodyCell class="p-1 text-xs">{d['_price_psf2']||''}</TableBodyCell>
        <TableBodyCell class="text-right">{d['_distance_from_klcc'] ? f1(d['_distance_from_klcc'])+'km' : ''}</TableBodyCell> -->


      </TableBodyRow>
    {/each}
  </TableBody>
</Table>