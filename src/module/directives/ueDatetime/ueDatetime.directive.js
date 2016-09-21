(function () {
    'use strict';

    var ueDatetime = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueDatetime/ueDatetime.html');
        }],
        controller: 'UeDatetimeController',
        controllerAs : 'vm'
    };

    /**
     * @desc Datetime-type field.
     * @example <div editor-field-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .component('ueDatetime', ueDatetime);
})();