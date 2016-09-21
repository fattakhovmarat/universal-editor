(function () {
    'use strict';

    var ueTime = {
        bindings : {
            field: "=",
            setError: "=",
            setErrorEmpty: "=",
            errorIndexOf: "=",
            parentField: "=",
            parentFieldIndex: "="
        },
        template : ['$templateCache', function ($templateCache) {
            return $templateCache.get('module/directives/ueTime/ueTime.html');
        }],
        controller: 'UeTimeController',
        controllerAs : 'vm'
    };

    /**
     * @desc String-type field.
     * @example <ue-time></ue-time>
     */
    angular
        .module('universal.editor')
        .component('ueTime', ueTime);
})();