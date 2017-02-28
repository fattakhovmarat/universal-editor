(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeFilterController', UeFilterController);

    UeFilterController.$inject = ['$scope', '$rootScope', '$element', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage', '$compile', '$document', '$templateCache'];

    function UeFilterController($scope, $rootScope, $element, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage, $compile, $document, $templateCache) {
        /* jshint validthis: true */
        var vm = this,
            settings;

        vm.$onInit = function() {
            var elementParent = vm.options.getParentElement().parents('.grid-toolbar');
            var templateEditorFilter = $compile($templateCache.get('module/components/ueFilter/filter-body.html'))($scope);
            var filterBody = elementParent.parent().find('.grid-filter-edit');

            if (filterBody.length !== 0) {
                filterBody.addClass('filter-component').append(templateEditorFilter);
            } else {
                $element.find('.filter-component').append(templateEditorFilter);
            }

            settings = vm.setting.component.settings;
            vm.parentComponentId = vm.options.$parentComponentId;
            vm.visiable = false;
            vm.filterName = vm.options.prefixGrid ? vm.options.prefixGrid + '-filter' : 'filter';
            FilterFieldsStorage.registerFilterController(vm);
            vm.header = settings.header;
            vm.body = [];
            angular.forEach(settings.dataSource.fields, function(field) {
                if (field.component.hasOwnProperty('settings') && (!settings.fields || ~settings.fields.indexOf(field.name)) && field.component.settings.filterable !== false) {
                    var fieldSettings = field.component.settings;
                    var group = {
                        label: fieldSettings.label,
                        operators: [],
                        filters: [{
                            field: field,
                            options: {
                                filterParameters: {
                                    operator: '%:text%',
                                    index: 0
                                },
                                filter: true,
                                $parentComponentId: vm.options.$parentComponentId,
                                paramsPefix: vm.options.prefixGrid,
                                regim: 'filter'
                            }
                        }]
                    };

                    /** convert to filter object from fields*/
                    fieldSettings.$toFilter = fieldSettings.$toFilter || function(operator, fieldValue) {
                        angular.forEach(fieldValue, function(value, key) {
                            if (operator && operator.indexOf(':text') !== -1) {
                                if (value && (!angular.isObject(value) || !$.isEmptyObject(value))) {
                                    fieldValue[key] = operator.replace(':text', value);
                                }
                                if (value === undefined || value === null || value === '' || (angular.isObject(value) && $.isEmptyObject(value))) {
                                    delete fieldValue[key];
                                }
                            } else {
                                if (value) {
                                    fieldValue[operator + key] = fieldValue[key];
                                }
                                delete fieldValue[key];
                            }
                        });
                        return fieldValue;
                    };

                    /** parse filter objects with operators*/
                    fieldSettings.$parseFilter = function(model, filterValue) {
                        var componentSettings = model.setting.component.settings;
                        var parentComponentId = model.parentComponentId;
                        var output = {};
                        angular.forEach(filterValue, function(value, key) {
                            //** delete operators from keys and value property
                            if (angular.isString(value)) {
                                value = value.replace(/^%/, '').replace(/%$/, '');
                            }
                            if (angular.isString(key)) {
                                key = key.replace(/^\>\=/, '').replace(/^\<\=/, '');
                            }

                            /** for date is required convert into date-type (at this moment we have two fields of date) */
                            if (field.component.settings.$fieldType === 'date') {
                                output[key] = output[key] || [];
                                output[key].push(moment.utc(value, model.format));
                            } else {
                                output[key] = value;
                            }
                        });
                        var value = output[model.fieldName];
                        if (angular.isArray(value)) {
                            value = value[model.options.filterParameters.index];
                        }
                        if (field.component.settings.$fieldType === 'array' && value) {
                            if (model.singleValue) {
                                if (model.falseValue == value) {
                                    model.fieldValue = [model.falseValue];
                                    model.indeterminate = false;
                                }
                                if (model.trueValue == value) {
                                    model.fieldValue = [model.trueValue];                                    
                                    model.indeterminate = false;
                                }
                            } else {
                                if (!angular.isString(value)) {
                                    value = value.toString();
                                }
                                model.fieldValue = value.split(',');
                            }
                        } else {
                            model.fieldValue = value;
                            if (model.addToSelected && value) {
                                model.fieldValue = {};
                                model.fieldValue[model.fieldId] = value;
                                model.addToSelected(null, model.fieldValue);
                            }
                        }
                        $timeout(function() {
                            var paramName = vm.options.prefixGrid ? vm.options.prefixGrid + '-filter' : 'filter';
                            if (!FilterFieldsStorage.getFilterQueryObject(paramName)) {
                                FilterFieldsStorage.calculate(parentComponentId, paramName);
                                $rootScope.$broadcast('editor:read_entity', model.options);
                                vm.visiable = true;
                            }
                        }, 0);
                        return output;
                    };

                    /*temprory custom logic for operators */

                    if (~['ue-dropdown', 'ue-autocomplete', 'ue-checkbox', 'ue-radiolist', 'ue-colorpicker'].indexOf(field.component.name)) {
                        group.filters[0].options.filterParameters.operator = ':text';
                    }

                    if (~['ue-date', 'ue-time', 'ue-datetime'].indexOf(field.component.name)) {
                        group.filters[0].ngStyle = 'display: inline-block; width: 25%; margin-left: 5px;';
                        group.filters[0].options.filterParameters.operator = '>=';
                        var cloneField = angular.copy(field);
                        group.filters.push({
                            field: cloneField,
                            options: {
                                filterParameters: {
                                    operator: '<=',
                                    index: 1
                                },
                                filter: true,
                                $parentComponentId: vm.options.$parentComponentId
                            },
                            ngStyle: 'display: inline-block; width: 25%; margin-left: 20px;'
                        });
                    }
                    vm.body.push(group);
                }
            });

            vm.footer = [];
            if (!settings.footer || !settings.footer.toolbar) {
                settings.footer = {
                    toolbar: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Применить',
                                    action: function(componentId) {
                                        FilterFieldsStorage.apply(componentId);
                                    }
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Очистить',
                                    action: function(componentId) {
                                        FilterFieldsStorage.clear(componentId);
                                    }
                                }
                            }
                        }
                    ]
                };
            }

            if (settings.footer && settings.footer.toolbar) {
                angular.forEach(settings.footer.toolbar, function(control) {
                    vm.footer.push(control);
                });
            }

            vm.toggleFilterVisibility = toggleFilterVisibility;

            vm.apply = function() {
                if (vm.options.$parentComponentId) {
                    FilterFieldsStorage.apply(vm.options.$parentComponentId);
                }
            };

            vm.clear = function() {
                if (vm.options.$parentComponentId) {
                    FilterFieldsStorage.clear(vm.options.$parentComponentId);
                }
            };
        };

        function toggleFilterVisibility() {
            vm.visiable = !vm.visiable;
        }

        $element.on('$destroy', function() {
            FilterFieldsStorage.unRegisterFilterController(vm.options);
            $scope.$destroy();
        });
    }
})();