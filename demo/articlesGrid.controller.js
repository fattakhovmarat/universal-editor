(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ArticlesGridController', ArticlesGridController);

    function ArticlesGridController() {
        var vm = this;
        var articlesDataSource = {
            standard: 'JSONAPI',
            resourceType: 'articles',
            transport: {
                url: 'http://localhost:16006/rest/articles'
            },
            sortBy: {
                id: 'desc'
            },
            primaryKey: 'id',
            keys: {
                meta: '_meta'
            },
            fields: [
                {
                    name: 'id',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'ID',
                            readonly: true
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
                    name: 'status',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            label: 'Status',
                            values: {
                                published: 'Published',
                                draft: 'Draft'
                            }
                        }
                    }
                },
                {
                    name: 'views',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Views'
                        }
                    }
                },
                {
                    name: 'created',
                    component: {
                        name: 'ue-date',
                        settings: {
                            label: 'Created',
                            disabled: true,
                            validators: [{
                                type: 'date',
                                format: 'YYYY-MM-DD'
                            }]
                        }
                    }
                }
            ]
        };

        vm.ueConfig = {
            component: {
                name: 'ue-grid',
                settings: {
                    dataSource: articlesDataSource,
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-filter',
                                    settings: {
                                        fields: ['id', 'title', 'status', 'views']
                                    }

                                }
                            },
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        label: 'Add',
                                        sref: 'articles_edit'
                                    }
                                }
                            }
                        ]
                    },
                    columns: ['id', 'title', 'created', 'status', 'views'],
                    contextMenu: [
                        {
                            component: {
                                name: 'ue-button',
                                settings: {
                                    label: 'Edit',
                                    sref: 'articles_edit'
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
                                    sref: 'articles'
                                }
                            }
                        }
                    ],
                    footer: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-pagination'
                                }
                            }
                        ]
                    }
                }
            }
        };
    }
})();
