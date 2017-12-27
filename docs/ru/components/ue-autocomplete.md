## ue-autocomplete

Поле аналогично полям [ue-checkbox](ue-checkbox.md) и [ue-dropdown](ue-dropdown). Существенным различием в работе данного поля является то, что данные выбираются не
из списка, а предоставляются пользователю как результат поиска по введенном слову / части слова.

```javascript
{
    name: 'ue-autocomplete',
    settings: {
        label: 'Autocomplete label',
        serverPagination: false,
        hint: 'Это поле автозаполнения',
        multiple: true,
        multiname: 'new_value',
        depend: 'other_field_name',
        delay: 1000,
        handlers: {
            change: function(newValue, oldValue) {
            }
        },
        draggable: true,
        width: 6,
        templates: {
            preview: '<span> {{value}} </span>',
            edit: function(scope) {
                scope.clickHandler = function(e) { /* логика */ };
                return '<input type="text" data-ng-disabled="readonly" name="{{name}}" data-ng-click="clickHandler($event)" data-ng-model="value" class="form-control input-sm"/>'
            },
            filter: 'module/components/templates/filterTemplate.html'
        },
        defaultValue: 'bla-bla-bla',
        values: {
            0: 'Draft',
            10: 'Archived',
            100: 'Published',
        },
        valuesRemote: {
            fields: {
                value: 'id',
                label: 'name'
            },
            url: 'http://universal-backend.test/rest/v1/staff'
        }
    }
}
```

| Параметр | Тип | Описание | Обязательный параметр? | Значение по-умолчанию |
| --- | --- | --- | --- | --- |
| name | string | Название компонента. | + | - |
| settings | object | Объект настройки компонента | + | - |
| settings[label] | string | Название поля (выводится в интерфейсе редактора) | + | - |
| settings[hint] | string | Текстовая информационная подсказка, выводимая слева от заголовка поля. | - | - |
| settings[delay] | integer | Задержка в миллисекундах при попытке поиска по введенной строке. | - | 600 | 
| settings[handler][change] | function | Слушатель, который вызывается при изменении значения компонента. Функция в качестве аргументов принимает новое и старое значение. | - | - |
| settings[draggable] | boolean | Разрешает перенос значений компонента в множественном режиме. Имеет силу только при уставленном параметре `multiple: true` | - | `false` |
| settings[required] | bool | Выделяет заголовок поля жирным, говоря об обязательности заполнения. | - | false |
| settings[serverPagination] | boolean | Флаг серверной пагинации. Если принимает значение `true`, то компонент будет делать запросы за всеми страницами с данными. | - | `false` |
| settings[multiple] | bool | Параметр отвечает за указание возможности поля принимать множественные значения. | - | false |
| settings[readonly] | bool | Параметр отвечает за указание активности компонента с точки зрения взаимодействия с пользователем. | - | false |
| settings[template] | object | Объект для настройки шаблонов. | - | - |
| settings[serverPagination] | boolean | Флаг серверной пагинации. Если принимает значение `true`, то компонент будет делать запросы за всеми страницами с данными. | - | `false` |
| settings[templates][preview] | string или function | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме просмотра (например отображение в таблице). | + | - |
| settings[templates][edit] | string или function  | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме редактирования (например отображение на форме редактирования). | + | - |
| settings[templates][filter] | string или function  | Строка с HTML-кодом шаблона, функция, возвращающая шаблон, или путь до шаблона в режиме фильтра (например, отображение в фильтре). | + | - |
| settings[multiname] | string | Ключ, который будет использован для создания массива в запросе к серверу в том случае, если поле работает в множественном режиме. Если ключ не установлен, то на сервер отправится массив вида `['value1', 'value2', 'value3']`. Если ключ установлен, например: `multiname:"value"`, то на сервер отправится массив вида `[["value"=>"value1"], ["value"=>"value2"], ["value"=>"value3"]]` | - | - |
| settings[width] | int | Ширина поля в единицах bootstrap-сетки, принимаемое значении от 1 до 6. | - | 6 |
| settings[defaultValue] | string | Значение поля по-умолчанию. | - | - |
| settings[depend] | string | Параметр отвечает за зависимость данного поля от поля с именем other_field_name. Поле с именем other_field_name должно быть описано в конфигурационном файле в рамках текущей сущности. Если поле other_field_name не заполнено, то текущее поле не активно. Если у компонентов, для которых требуется делать запрос для получения значений по API, в поле адреса запроса указаны `:dependField` и `:dependValue`(например, `/api/service/v1/json/categories?filter={:dependField::dependValue}`) , то они заменятся на имя поля указанного в depend и значение этого поля соответственно. | - | - |
| settings[values] | object или array | Если тип object, то содержит в себе элементы списка в формате "ключ": "значение". На сервер будут отправляться ключ (и). Пользователю для выбора в редакторе будут доступны значения. Если тип array, то элемент массива является и ключом, и значением одновременно.  | - | - |
| settings[valuesRemote] | object | Означает, что данные для поля необходимо забирать с другого API. | - | - |
| settings[valuesRemote][fields] | object | Описывает работу с данными другого API. | + | - |
| settings[valuesRemote][fields][value] | string | Указывает, какое поле использовать в качестве "ключа" в паре "ключ": "значение". | - | 'id' |
| settings[valuesRemote][fields][label] | string | Указывает, какое поле использовать в качестве "значения" в паре "ключ": "значение". Если параметр не указан, то в роли "значения" будет поле settings[valuesRemote][fields][value]  | - | - |
| settings[valuesRemote][url] | object | URL API | + | - |

Одновременно может быть указан только один из форматов получения данных для поля ( values или valuesRemote ).