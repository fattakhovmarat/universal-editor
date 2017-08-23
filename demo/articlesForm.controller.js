(function() {
    'use strict';

    angular
        .module('demoApp')
        .controller('ArticlesFormController', ArticlesFormController);

    ArticlesFormController.$inject = ['$state'];

    function ArticlesFormController($state) {
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
                meta: 'meta'
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
                    name: 'author.id',
                    resourceType: 'people',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            expandable: true,
                            label: 'Author',
                            valuesRemote: {
                                fields: {
                                    key: 'id',
                                    label: 'firstname'
                                },
                                url: 'http://localhost:16006/rest/people'
                            }
                        }
                    }
                },
                {
                    name: 'comments[].id',
                    resourceType: 'comments',
                    component: {
                        name: 'ue-dropdown',
                        settings: {
                            expandable: true,
                            valuesRemote: {
                                fields: {
                                    key: 'id',
                                    label: 'body'
                                },
                                url: 'http://localhost:16006/rest/comments'
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
                    name: 'content',
                    component: {
                        name: 'ue-string',
                        settings: {
                            label: 'Text'
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
                            readonly: true,
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
                name: 'ue-form',
                settings: {
                    dataSource: articlesDataSource,
                    primaryKeyValue: function() {
                        if ($state.params.pk === 'new') {
                            return null;
                        }
                        return $state.params.pk;
                    },
                    header: {
                        toolbar: [
                            {
                                component: {
                                    name: 'ue-button',
                                    settings: {
                                        sref: 'articles',
                                        useBackUrl: true,
                                        template: '<div class="close-editor" ng-click="vm.click()"> </div>'
                                    }
                                }
                            }
                        ]
                    },
                    body: [
                        {
                            component: {
                                name: 'ue-form-tabs',
                                settings: {
                                    tabs: [
                                        {
                                            label: 'Main tab',
                                            fields: ['id', 'title', 'created', 'status', 'views', 'content', 'author.id',
                                                {
                                                    name: 'comments',
                                                    component: {
                                                        name: 'ue-group',
                                                        settings: {
                                                            multiple: true,
                                                            label: 'Comments',
                                                            fields: ['id']
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        };
    }
})();
