# Dynamic Search Input

## Resume
This library creates a dynamic search field and returns a json structure for sql query.

![Example](https://github.com/jhonesdev/dynamic-search-input/blob/main/images/example_1.png?raw=true)
![Example](https://github.com/jhonesdev/dynamic-search-input/blob/main/images/example_2.png?raw=true)

## Get Started

Import dependences

```html
<script src="js/JQuery.js"></script>
<script src="plugins/bootstrap/js/bootstrap.js"></script>
<script src="js/JFilters.js"></script>
```

## Usage

```html
<script>

    let element = $('#search-field'); // div for make component

    var SearchWith = element.JFilters({
        fields: [ // Set fields and types of filter
            { field: "name", type: "text", label: "Nome" },
            { field: "age", type: "int", label: "Idade" }
        ]
    });

    element.on('draw', function () { // component update event
        $('#feedback').html(SearchWith.filters()); // get updated filters
    });

</script>
```

## License

MIT

**Free Software, Hell Yeah!**