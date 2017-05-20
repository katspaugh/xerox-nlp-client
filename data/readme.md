The tag-set JSON files were extracted from the [Xerox website](1) using the following script:

    const table = document.querySelector('#service_home_page>table');
    const titles = [ 'tag', 'description', 'example' ];
    const data = [].map.call(table.rows, (row) => {
     return [].reduce.call(row.cells, (obj, cell, i) => {
       obj[titles[i]] = cell.textContent.trim();
       return obj;
     }, {});
    });
    copy(JSON.stringify(data.slice(1), 2, 2));

[1](https://open.xerox.com/Services/fst-nlp-tools/Pages/Part-of-Speech%20Tagsets)
