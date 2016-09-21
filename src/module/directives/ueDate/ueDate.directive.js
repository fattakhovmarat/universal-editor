(function () {
    'use strict';

    var ueDate = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueDate/ueDate.html');
        }],
        controller: 'UeDateController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-date></ue-date>
     */
    angular
        .module('universal.editor')
        .component('ueDate',ueDate);
})();