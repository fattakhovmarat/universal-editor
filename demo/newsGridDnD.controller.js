(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('newsGridDnDController', newsGridDnDController);

    function newsGridDnDController($http) {
        'ngInject';
        var vm = this;
        var newsDataSource = {
            standard: 'YiiSoft',
            url: '/assets/dragAndDrop.1.json',
            sortBy: '-id',
            primaryKey: 'id',
            tree: {
                childrenField: 'childs',
                childrenCountField: 'childs_count',
                selfField: 'self'
            },
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            template: '',
                            validators: [
                                {
                                    type: 'number'
                                }
                            ]
                        }
                    }
                },
                {
                    name: 'published_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Publication date'
                        }
                    }
                },
                {
                    name: 'category_id',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Category',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'title'
                                },
                                url: 'http://universal-backend.dev/rest/v1/news/categories'
                            },
                            search: true
                        }
                    }
                },
                {
                    name: 'title',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Title'
                        }
                    }
                },
                {
                    name: 'description',
                    component: {
                        name: 'ue-textarea',
                        settings: {
                            label: 'Text'
                        }
                    }
                },
                {
                    name: 'authors',
                    component: {
                        name: 'ue-autocomplete',
                        settings: {
                            label: 'Authors',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/staff'
                            },
                            multiple: true,
                            expandable: true,
                            multiname: 'staff_id'
                        }
                    }
                },
                {
                    name: 'tags',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Tags',
                            valuesRemote: {
                                fields: {
                                    value: 'id',
                                    label: 'name'
                                },
                                url: 'http://universal-backend.dev/rest/v1/tags'
                            },
                            multiple: true,
                            expandable: true
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
                    name: 'updated_at',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Updated'
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: newsDataSource,
                    dragMode: {
                        start: function(e, element, collection) {
                        },
                        over: function(e, element, destElement, collection) {
                        },
                        drop: function(e, element, destElement, collection) {
                            return true;
                        },
                        dragDisable: function(element, collection) {
                            return false;
                        },
                        type: function(element, collection) {
                            return 'news';
                        },
                        allowedTypes: function(element, collection) {
                            return ['news'];
                        },
                        expandHandler: function(dataSource, element) {
                            return $http.get('/assets/dragAndDrop.childs.json').then(function(response) {
                                return response.data.items;
                            });
                        }
                    },
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-filter'
                                }
                            }
                        ]
                    },
                    columns: [{
                        name: 'id',
                        width: "20%"
                    }, 
                    {
                        name: 'title',
                        width: "300px"
                    },
                    {
                        name: 'authors',
                        width: "200px"
                    },
                    {
                        name: 'category_id',
                        width: "200px"
                    }],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Delete',
                                    action: 'delete'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination',
                                    settings: {
                                        label: {
                                            last: '>>',
                                            next: '>'
                                        }
                                    }
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
