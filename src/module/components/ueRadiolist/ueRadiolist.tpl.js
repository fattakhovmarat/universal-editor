(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/ueRadiolist/ueRadiolist.html',
    '\n' +
    '<div ng-class="{\'field-wrapper row\':!vm.options.filter, \'filter-wrapper-field\': vm.options.filter}">\n' +
    '    <div on-render-template="on-render-template" ng-class="{\'component-filter\': vm.templates.filter &amp;&amp; vm.regim === \'filter\',                   \'component-edit\': vm.templates.edit  &amp;&amp; vm.regim === \'edit\',                   \'component-preview\': vm.templates.preview &amp;&amp; vm.regim === \'preview\'}" class="component-template"></div>\n' +
    '    <div ng-if="(!vm.templates.edit &amp;&amp; vm.regim === \'edit\') || (!vm.templates.filter &amp;&amp; vm.regim === \'filter\')" ng-class="{\'component-filter\': vm.regim === \'filter\'}" class="component-edit">\n' +
    '        <label ng-if="!vm.options.filter &amp;&amp; !!vm.label" class="field-name-label">\n' +
    '            <div data-ng-if="!!vm.hint" class="field-hint">\n' +
    '                <div ng-bind="::vm.hint" class="hint-text"></div>\n' +
    '            </div><span data-ng-class="{\'editor-required\': vm.required}" ng-bind="::vm.label"></span>\n' +
    '        </label>\n' +
    '        <div ng-class="{\'filter-inner-wrapper\': vm.options.filter, \'field-element\': !vm.options.filter}" ng-if="!vm.disabled || vm.options.filter">\n' +
    '            <div data-ng-repeat="item in vm.optionValues" data-ng-class="{\'radiodisabled\': vm.readonly}">		\n' +
    '                <label class="radio">\n' +
    '                    <input type="radio" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" value="{{::item[vm.fieldId]}}"/><span ng-bind="::item[vm.fieldSearch]"></span>\n' +
    '                </label>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div ng-if="vm.disabled &amp;&amp; !vm.options.filter" class="disabled-field">\n' +
    '            <div><span ng-bind="::vm.previewValue" data-ng-show="!vm.loadingData" ng-if="!vm.multiple"></span>\n' +
    '                <div ng-repeat="value in vm.previewValue track by $index" data-ng-show="!vm.loadingData" ng-if="vm.multiple"><span ng-bind="value"></span></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.templates.preview &amp;&amp; vm.regim === \'preview\'" class="component-preview"> \n' +
    '        <div data-ng-show="vm.loadingData" class="loader-search-wrapper">\n' +
    '            <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '        </div><span ng-bind="::vm.previewValue" data-ng-show="!vm.loadingData" ng-if="!vm.multiple"></span>\n' +
    '        <div ng-repeat="value in vm.previewValue track by $index" data-ng-show="!vm.loadingData" ng-if="vm.multiple"><span ng-bind="value"></span></div>\n' +
    '    </div>\n' +
    '    <div ng-if="!vm.options.filter" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
