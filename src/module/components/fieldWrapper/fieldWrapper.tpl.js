(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/components/fieldWrapper/fieldWrapper.html',
    '\n' +
    '<div data-ng-class="!vm.isArray ? \'row\' : \'\' " class="field-wrapper">\n' +
    '    <div class="form-group">\n' +
    '        <label data-ng-if="!vm.isArray" class="field-name-label">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </label>\n' +
    '        <div class="field-element"></div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.isArray" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
