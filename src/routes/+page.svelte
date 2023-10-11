<script>

  export let data;

  console.log('data', data);


  let rows=[];

  data.raw.forEach(d=>{

    if (!d['Size B'].match(/\w+/)) d['Size B'] = '' + d['Size'];
    if (!d['Rooms B'].match(/\w+/)) d['Rooms B'] = '' + d['Rooms'];
    if (!d['Price B'].match(/\w+/)) d['Price B'] = '' + d['Price'];
    if (!d['Title B'].match(/\w+/)) d['Title B'] = '' + d['Title'];

    delete d['Size'];
    delete d['Rooms'];
    delete d['Price'];
    delete d['Title'];


    let sizes = d['Size B'].split(/\n/);
    let rooms = d['Rooms B'].split(/\n/);
    let prices = d['Price B'].split(/\n/);
    let status = d['Status B'].split(/\n/);
    let titles = d['Title B'].split(/\n/);
    let remarks = d['Rooms remarks'].split(/\n/);

    delete d['Size B'];
    delete d['Rooms B'];
    delete d['Price B'];
    delete d['Title B'];
    delete d['Status B'];
    delete d['Rooms remarks'];

    let k = {...d};

    for (let i=0;i<sizes.length-1;i++) {
      let p = {...k};

      p['Size'] = sizes[i] || null;
      p['Rooms'] = rooms[i] || null;
      p['Price'] = prices[i] || null;
      p['Status'] = status[i] || null;
      p['Title'] = titles[i] || null;
      p['Room Remarks'] = remarks[i] || null;


      rows.push(p);
    }

    // d['Size B'].split(/\n/).forEach(j=>{
    //   let p = {...k};
    //   p['Size B'] = j;
    // });



  })

  console.log('rows', rows);


  import { Alert } from 'flowbite-svelte';
</script>

<div class="p-8">
  <Alert>
    <span class="font-medium">Info alert!</span>
    Change a few things up and try submitting again.
  </Alert>
</div>