(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonLinkController', UeButtonLinkController);

    UeButtonLinkController.$inject = ['$scope', '$element', 'RestApiService', '$state', '$location', 'configData', 'EditEntityStorage', 'ModalService', '$timeout', '$controller', '$window'];

    function UeButtonLinkController($scope, $element, RestApiService, $state, $location, configData, EditEntityStorage, ModalService, $timeout, $controller, $window) {
        $element.addClass('ue-button');

        var vm = this;
        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
        var state = vm.setting.component.settings.state;
        var url = vm.setting.component.settings.url;
        vm.entityId = vm.entityId || 'new';

        $element.bind("click", function() {
            var stateOptions = {
                reload: true
            };

            if (vm.options.isLoading) {
                return;
            }

            if (!state && url) {
                if (angular.isString(url)) {
                    ModalService.options = vm.options;
                    url = url.replace(':id', vm.entityId);
                    var isReload = !~url.indexOf($location.path());
                    $window.location.href = url;
                    if (isReload) {
                        $window.location.reload();
                    }
                }
            } else {
                var toStateConfig = EditEntityStorage.getStateConfig(state);
                if (!toStateConfig) {
                    console.warn('Стейт ' + state + ' не найден в конфигурационном файле.');
                }
                var pkKey = 'pk' + EditEntityStorage.getLevelChild(toStateConfig.name);
                var params = {};
                params[pkKey] = vm.entityId;


                var searchString = $location.search();
                if (toStateConfig) {
                    if (toStateConfig.component.name === 'ue-modal') {
                        ModalService.options = vm.options;
                        stateOptions.reload = false;
                    } else {
                        if (!!vm.options && !!vm.options.back) {
                            searchString.back = EditEntityStorage.getStateConfig().name;
                        }
                    }
                }
                $state.go(toStateConfig.name, params, stateOptions).then(function() {
                    $location.search(searchString);
                    $timeout(function() {
                        var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
                        if (pk === 'new' && !ModalService.isModalOpen()) {
                            EditEntityStorage.newSourceEntity(vm.options.$parentComponentId, vm.setting.component.settings.dataSource.parentField);
                        }
                    }, 0);
                });
            }
        });

        vm.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };
    }
})();