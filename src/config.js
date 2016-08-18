(function($){
    var config = {
        "entities": [
            {
                "name": "staff",
                "label": "Сотрудники",
                "backend": {
                    "url": "http://universal-backend.dev/rest/v1/staff",
                    "sortBy": "-id",
                    "fields": {
                        "primaryKey": "id",
                        "parent": "parent_id"
                    }
                },
                "tabs": [
                    {
                        "label": "Карточка",
                        "fields": [
                            {
                                "name": "name",
                                "type": "string",
                                "list": true,
                                "label": "Имя",
                                "required": true
                            },
                            {
                                "name": "email",
                                "type": "string",
                                "list": true,
                                "label": "Эл. почта",
                                "required": true
                            },
                            {
                                "name": "gender",
                                "type": "radiolist",
                                "list": true,
                                "label": "Пол",
                                "filterable": true,
                                "values": {
                                    "male" : "Мужской",
                                    "female" : "Женский"
                                },
                                "showOnly" : "edit"
                            },
                            {
                                "name": "country",
                                "type": "select",
                                "list": true,
                                "label": "Страна",
                                "filterable": true,
                                "valuesRemote": {
                                    "fields": {
                                        "value": "id",
                                        "label": "name"
                                    },
                                    "url": "http://universal-backend.dev/rest/v1/country"
                                }
                            },
                            {
                                "name": "notes",
                                "label": "Заметки",
                                "type": "array",
                                "fields": [
                                    {
                                        "name": "color",
                                        "type": "colorpicker",
                                        "list": true,
                                        "label": "Любимый цвет"
                                    },
                                    {
                                        "name": "text",
                                        "type": "textarea",
                                        "label": "Дополнительные заметки"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "label": "Служебное",
                        "fields": [
                            {
                                "name": "fired",
                                "type": "checkbox",
                                "label": "Уволен",
                                "values": {
                                    "1": ""
                                }
                            },
                            {
                                "name": "created_at",
                                "type": "datetime",
                                "readonly": true,
                                "label": "Дата создания"
                            },
                            {
                                "name": "updated_at",
                                "type": "datetime",
                                "readonly": true,
                                "label": "Дата обновления"
                            }
                        ]
                    }
                ],
                "contextMenu": [
                    {
                        "label": "Раскрыть",
                        "type": "open"
                    },
                    {
                        "label": "Редактировать",
                        "type": "edit"
                    },
                    {
                        "label": "Удалить",
                        "type": "delete"
                    }
                ],
                "listHeaderBar": [
                    {
                        "type": "create",
                        "label": "Создать"
                    }
                ],
                "editFooterBar": [
                    {
                        "type": "update",
                        "label": "Сохранить"
                    },
                    {
                        "type": "presave",
                        "label": "Применить"
                    },
                    {
                        "type": "delete",
                        "label": "Удалить"
                    }
                ]
            },
            {
                "name": "news",
                "label": "Новости",
                "backend": {
                    "url": "http://universal-backend.dev/rest/v1/news",
                    "sortBy": "-id",
                    "fields": {
                        "primaryKey": "id",
                        "parent": "parent_id"
                    }
                },
                "tabs": [
                    {
                        "label": "Новость",
                        "fields": [
                            {
                                "name": "published",
                                "type": "checkbox",
                                "list": true,
                                "label": "Опубликовано",
                                "values": {
                                    "1": ""
                                }
                            },
                            {
                                "name": "published_at",
                                "type": "datetime",
                                "list": true,
                                "label": "Дата публикации"
                            },
                            {
                                "name": "category_id",
                                "type": "select",
                                "label": "Категория",
                                "list": true,
                                "filterable": true,
                                "valuesRemote": {
                                    "fields": {
                                        "value": "id",
                                        "label": "title",
                                        "parent": "parent_id",
                                        "childCount": "child_count"
                                    },
                                    "url": "http://universal-backend.dev/rest/v1/news/category"
                                },
                                "search": true,
                                "tree": true,
                                "selectBranches": true
                            },
                            {
                                "name": "title",
                                "type": "string",
                                "list": true,
                                "label": "Заголовок",
                                "required": true
                            },
                            {
                                "name": "description",
                                "type": "textarea",
                                "list": true,
                                "label": "Краткое описание",
                                "required": true
                            },
                            {
                                "name": "text",
                                "type": "wysiwyg",
                                "label": "Текст"
                            }
                        ]
                    },
                    {
                        "label": "Место",
                        "fields": [
                            {
                                "name": "coordinates",
                                "type": "map",
                                "label": "Местоположение события"
                            }
                        ]
                    },
                    {
                        "label": "Служебное",
                        "fields": [
                            {
                                "name": "created_at",
                                "type": "datetime",
                                "readonly": true,
                                "label": "Дата создания"
                            },
                            {
                                "name": "updated_at",
                                "type": "datetime",
                                "readonly": true,
                                "label": "Дата обновления"
                            }
                        ]
                    }
                ],
                "contextMenu": [
                    {
                        "label": "Раскрыть",
                        "type": "open"
                    },
                    {
                        "label": "Редактировать",
                        "type": "edit"
                    },
                    {
                        "label": "Удалить",
                        "type": "delete"
                    }
                ],
                "listHeaderBar": [
                    {
                        "type": "create",
                        "label": "Создать"
                    }
                ],
                "editFooterBar": [
                    {
                        "type": "update",
                        "label": "Сохранить"
                    },
                    {
                        "type": "presave",
                        "label": "Применить"
                    },
                    {
                        "type": "delete",
                        "label": "Удалить"
                    }
                ]
            }
        ]
    };
    var editor = new UniversalEditor('universal-editor', config);
})(jQuery);