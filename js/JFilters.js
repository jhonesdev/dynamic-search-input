/*!
 * JFilters.js v1.0.0
 * by Kessy Jhones
 */

(function($) {

    $.fn.JFilters = function(options) {

        let component = $(this);

        let filters = [];

        let conditions = [{
                op: 'ilike',
                type: ['text', 'text-uppercase'],
                op_label: 'contêm',
                value: function(value) {
                    return '%' + value + '%';
                }
            }, {
                op: '=',
                op_label: 'igual a',
                type: ["int", "date", "d-date"],
                value: function(value) {
                    return value;
                }
            },
            {
                op: '=',
                op_label: 'igual a',
                type: ['text-uppercase'],
                value: function(value) {
                    return value.toUpperCase();
                }
            },
            {
                op: '=',
                op_label: 'igual a',
                type: ["numeric"],
                value: function(value) {
                    return value.replace(',', '.');
                }
            },
            {
                op: '>',
                type: ["int", "date", "d-date"],
                op_label: 'maior que',
                value: function(value) {
                    return value.replace('.', '').replace(',', '.');
                }
            },
            {
                op: '<',
                type: ["int", "date", "d-date"],
                op_label: 'menor que',
                value: function(value) {
                    return value.replace('.', '').replace(',', '.');
                }
            },
            {
                op: '=',
                type: ["bool", "n-bool", "rel-bool", "bool-coleta"],
                op_label: '',
                value: function(value) {
                    return value.toLowerCase() == 'sim' ? true : false;
                }
            },
            {
                op: '=',
                op_label: 'igual a',
                type: ["real"],
                value: function(value) {
                    let value_real = value.replace('.', '');
                    return value_real.replace(',', '.');
                }
            },
            {
                op: '>',
                op_label: 'maior que',
                type: ["real"],
                value: function(value) {
                    let value_real = value.replace('.', '');
                    return value_real.replace(',', '.');
                }
            },
            {
                op: '<',
                op_label: 'menor que',
                type: ["real"],
                value: function(value) {
                    let value_real = value.replace('.', '');
                    return value_real.replace(',', '.');
                }
            },
            {
                op: '>=',
                type: ["d-date"],
                op_label: "dias atrás",
                value: function(value) {
                    return value + ' dias atrás';
                }
            },
            {
                op: '<=',
                type: ["d-date"],
                op_label: "atÃ© hoje",
                value: function(value) {
                    return 'hoje';
                }
            },
            {
                op: '><',
                type: ["d-date"],
                op_label: "mês atual",
                value: function(value) {
                    return 'mês atual';
                }
            },
            {
                op: '><',
                type: ["d-date"],
                op_label: "mês anterior",
                value: function(value) {
                    return 'mês anterior';
                }
            }
        ];

        let template_filter = ` <div class="d-flex flex-wrap border p-1" style="border-radius: 20px!important;padding-left: 10px !important;">
                                  <span class="mr-1"><i class="fas fa-sliders-h"></i> Filtros:</span>
                                  <div class="applied-filters">
                                      <div class="dropdown w-100">
                                          <input type="text" name="search-term" class="w-100 border-0" />
                                          <div role="menu" class="dropdown-menu p-0" style="max-height:300px; overflow-y:scroll;"></div>
                                      </div>
                                  </div>
                                </div>`;

        let template_input = ` <div class="d-flex flex-wrap border p-1" style="padding-left: 10px !important;">
                                  <div class="applied-filters">
                                      <div class="dropdown w-100">
                                          <input type="text" name="search-term" class="w-100 border-0" />
                                          <div role="menu" class="dropdown-menu p-0" style="max-height:300px; overflow-y:scroll;"></div>
                                      </div>
                                  </div>
                                </div>`;

        component.html(template_filter);

        if (options.input != undefined && options.input == true) {
            component.html(template_input);
        }

        if (options.filters != undefined) {
            for (let i = 0; i < options.filters.length; i++) {
                //add Filter
                filters.push({
                    field: options.filters[i].field,
                    condition: options.filters[i].condition,
                    value: options.filters[i].value,
                    short_label: options.filters[i].short_label,
                    label: options.filters[i].label
                });
            }

            //Event Emmitter
            component.trigger('draw', filters);

            //Refresh Filters View
            updateFilters();

            component.find('input[name=search-term]').val('');
            component.find('.dropdown-menu').removeClass('show');
            component.find('input[name=search-term]').focus();
        }

        component.children().on('click', function(e) {
            if (e.target != this) return;
            component.find('input[name=search-term]').focus();
        });

        component.on('keydown', 'input[name=search-term]', function(e) {
            if ($(this).val() != '')
                component.find('.dropdown-menu').addClass('show');
            else
                component.find('.dropdown-menu').removeClass('show');

            if (e.key === 'ArrowDown') {
                component.find('.dropdown-menu input[name=search-condition]').focus();
            }
        });

        /*
         *  DropDown options
         */
        component.on('keyup', 'input[name=search-term]', function() {
            fields = options.fields;
            component.find('.dropdown-menu').html('');
            component.find('.dropdown-menu').append('<input type="text" name="search-condition" placeholder="Buscar filtro..." class="w-100 border-0 p-2" />');
            for (let i = 0; i < fields.length; i++) {
                for (let ii = 0; ii < conditions.length; ii++) {
                    if (fields[i].type) {
                        let type = conditions[ii]['type'].indexOf(fields[i].type);
                        if (type != -1) {
                            switch (conditions[ii].op_label) {
                                case 'atÃ© hoje':
                                    component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" data-type="' + type + '" class="dropdown-item">' + fields[i].label + ' ' + conditions[ii].op_label + '</a>');
                                    break;

                                case 'dias atrÃ¡s':
                                    component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" data-type="' + type + '" class="dropdown-item">' + fields[i].label + ' "' + this.value + '" ' + conditions[ii].op_label + '</a>');
                                    break;

                                case 'mÃªs atual':
                                    component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" data-type="' + type + '" class="dropdown-item">' + fields[i].label + ' ' + conditions[ii].op_label + '</a>');
                                    break;

                                case 'mÃªs anterior':
                                    component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" data-type="' + type + '" class="dropdown-item">' + fields[i].label + ' ' + conditions[ii].op_label + '</a>');
                                    break;

                                default:
                                    component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" data-type="' + type + '" class="dropdown-item">' + fields[i].label + ' ' + conditions[ii].op_label + ' "' + this.value + '"</a>');
                                    break;
                            }
                        }
                    } else {
                        component.find('.dropdown-menu').append('<a href="#" data-field="' + i + '" data-condition="' + ii + '" class="dropdown-item">' + fields[i].label + ' ' + conditions[ii].op_label + ' "' + this.value + '"</a>');
                    }
                }
            }
        })

        /*
         *  DropDown navegation
         */
        component.on('keydown', '.dropdown-menu a', function(e) {
            switch (e.key) {
                case 'ArrowDown':
                    $(this).nextAll(':visible').eq(0).focus();
                    break;
                case 'ArrowUp':
                    $(this).prevAll(':visible').eq(0).focus();
                    break;
            }
        });

        component.on('keydown', '.dropdown-menu a:first-child', function(e) {
            if (e.key === 'ArrowUp') {
                component.find('input[name=search-term]').focus();
            }
        });

        /*
         *  Add Filter
         */
        component.on('click', '.dropdown-menu a', function(e) {

            //add Filter
            filters.push({
                field: options.fields[$(this).attr('data-field')].field,
                type: conditions[$(this).attr('data-condition')].type[$(this).attr('data-type')],
                condition: conditions[$(this).attr('data-condition')].op,
                value: conditions[$(this).attr('data-condition')].value(component.find('input[name=search-term]').val()),
                short_label: (conditions[$(this).attr('data-condition')].op_label != 'atÃ© hoje') ? component.find('input[name=search-term]').val() : 'hoje',
                label: $(this).html()
            });

            //Event Emmitter
            component.trigger('draw', filters);

            //Refresh Filters View
            updateFilters();

            component.find('input[name=search-term]').val('');
            component.find('.dropdown-menu').removeClass('show');
            component.find('input[name=search-term]').focus();

            return false;
        });

        function updateFilters() {
            component.find('.applied-filters').html('');
            for (let i = 0; i < filters.length; i++) {
                component.find('.applied-filters').append(
                    '<span data-filter="' + i + '" class="badge badge-pill badge-info mr-1">' +
                    '   <span data-toggle="tooltip" title="" data-placement="top" data-original-title="' + filters[i].label.replaceAll('"', "'") + '">' +
                    filters[i].short_label +
                    '   </span>' +
                    '   <i class="cursor-pointer">&times;</i>' +
                    '</span>'
                );
            }
            component.find('.applied-filters').append(
                '  <div class="dropdown d-inline-block">' +
                '      <input type="text" name="search-term" class="w-100 border-0" />' +
                '      <div role="menu" class="dropdown-menu p-0" style="max-height:300px; overflow-y:scroll;"></div>' +
                '  </div>'
            );
        }

        /*
         *  Remove Filter
         */
        component.find('.applied-filters').on('click', 'span i', function() {
            //Remove Filter
            filters.splice($(this).parent().attr('data-filter'), 1);

            //Event Emmitter
            component.trigger('draw', filters);

            //Refresh Filters View 
            updateFilters();
        });

        /*
         *  Search Filters
         */
        component.on('keydown', 'input[name=search-condition]', function(e) {
            if (e.key === 'ArrowUp') {
                component.find('input[name=search-term]').focus();
            }
            if (e.key === 'ArrowDown') {
                $(this).nextAll(':visible').eq(0).focus();
            }
        });

        component.on('keyup', 'input[name=search-condition]', function() {
            var value = $(this).val().toLowerCase();
            component.find('.dropdown-menu a').filter(function() {
                let conditionText = $(this).text().toLowerCase();
                let searchTerm = component.find('input[name=search-term]').val().toLowerCase();
                if (conditionText.lastIndexOf(' "' + searchTerm + '"') > -1) {
                    conditionText = conditionText.substring(0, (conditionText.lastIndexOf(' "' + searchTerm + '"') + 1));
                }
                $(this).toggle(conditionText.indexOf(value) > -1)
            });
        });

        return {
            activeFilters: function() {
                return JSON.stringify(filters);
            },
            initFilters: function(data) {
                filters = JSON.parse(data);
                component.trigger('draw', filters);
                updateFilters();
            },
            filter: function(data) {
                filters.push(data);
                component.trigger('draw', filters);
                updateFilters();
            },
            filters: function() {
                var data = {};
                for (let i = 0; i < filters.length; i++) {
                    if (data[filters[i].field] == undefined) {
                        data[filters[i].field] = [{
                            condition: filters[i].condition,
                            value: filters[i].value,
                            type: filters[i].type
                        }];
                    } else {
                        data[filters[i].field].push({
                            condition: filters[i].condition,
                            value: filters[i].value,
                            type: filters[i].type
                        });
                    }

                }
                return JSON.stringify(data);
            },
            clear: function() {
                filters = [];
                updateFilters();
            },
            options: function(opt) {
                options = opt;
            }
        }

    };
})(jQuery);