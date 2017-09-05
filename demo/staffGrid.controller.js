(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('StaffGridController', StaffGridController);

    StaffGridController.$inject = ['$rootScope'];
    function StaffGridController($rootScope) {
        'ngInject';
        var vm = this;
        var contextRecordId;
        var record;

        $rootScope.$on('ue-grid:contextMenu', function(e, data) {
            record = data.record;
            var primaryKey = data.primaryKey;
            contextRecordId = record[primaryKey];
        });

        var staffDataSource = {
            standard: 'YiiSoft',
            sortBy: {
                id: 'desc'
            },            
            primaryKey: 'id',
            parentField: 'parent_id',
            keys: {
                items: 'items',
                meta: '_meta'
            },
            transport: {
                url: '//universal-backend.dev/rest/v1/staff',
                read: {
                    url: '//universal-backend.dev/rest/v1/staff',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return { expand: 'field', params: 'p' };
                    },
                    data: function() {
                        return { data: 'field' };
                    },
                    method: 'GET',
                    handlers: {
                        before: function(config, e) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                },
                one: {
                    url: '//universal-backend.dev/rest/v1/staff',
                    headers: function() {
                        return {};
                    },
                    params: function() {
                        return { expand: 'field', params: 'p' };
                    },
                    data: function() {
                        return { data: 'field' };
                    },
                    method: 'GET',
                    handlers: {
                        before: function(config) {
                            console.log('Before handler!');
                        },
                        error: function(reject) {
                            console.log('Error handler!');
                        },
                        success: function(response) {
                            console.log('Success handler!');
                        },
                        complete: function() {
                            console.log('Complete handler!');
                        }
                    }
                }
            },

            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ]
                        }
                    }
                },
                {
                    name: 'name',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Name'
                        }
                    }
                },
                {
                    name: 'email',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'E-mail',
                            contentType: 'email'
                        }
                    }
                },
                {
                    name: 'gender',
                    component: {
                        name: 'ue-radiolist',
                        settings: {
                            label: 'Gender',
                            values: {
                                'male': 'Male',
                                'female': 'Female'
                            }
                        }
                    }
                },
                {
                    name: 'parent_id',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Head',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/staff'
                            },
                            multiple: false
                        }
                    }
                },
                {
                    name: 'colors',
                    component: {
                        name: 'ue-colorpicker',
                        settings: {
                            label: 'Favorite colors',
                            multiname: 'color',
                            expandable: true
                        }
                    }
                },
                {
                    name: 'fired',
                    component: {
                        name: 'ue-checkbox',
                        settings: {
                            label: 'Fired',
                            trueValue: 1,
                            falseValue: 0
                        }
                    }
                },

                {
                    name: 'created_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created'
                        }
                    }
                },
                {
                    name: 'country',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Country',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/country'
                            },
                            multiple: false,
                            placeholder: 'country of residence'
                        }
                    }
                },
                {
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated',
                            disabled: true
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: staffDataSource,                    
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-filter',
                                    settings: {
                                        fields: ['id', 'name', 'email', 'gender', 'created_at', 'country', 'parent_id']
                                    }
                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add',
                                        sref: 'staff_edit'
                                    }
                                }
                            }
                        ]
                    },
                    columns: [
                        {
                            name: 'name',
                            sortable: false
                        }, 'email', 'gender', 'parent_id'],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Subordinate',
                                    action: 'open'
                                }
                            }
                        },
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Edit',
                                    sref: {
                                        name: 'staff_edit',
                                        parameters: function() {
                                            return { 'pk': contextRecordId };
                                        }
                                    }
                                }
                            }
                        },
                        {
                            separator: true,
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Delete',
                                    action: 'delete',
                                    sref: 'staff'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination',
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
