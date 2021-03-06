let angular = window.angular;

function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, ApiService, moment, EditEntityStorage, $q, $translate, $element) {
  'ngInject';
  $controller('BaseController', { $scope: $scope, $element: $element });
  var self = $scope.vm,
    componentSettings = self.setting.component.settings,
    values,
    remoteValues;

  self.clearDefault = self.clear = clear;
  self.getFieldValue = getFieldValue;
  self.equalPreviewValue = equalPreviewValue;
  self.inputLeave = inputLeave;
  self.checkForEmptyValue = checkForEmptyValue;

  self.onChangeFieldValue = onChangeFieldValue;
  $scope.onLoadDataHandler = self.onLoadDataHandler = onLoadDataHandler;

  setInitialGeneralSettings();

  setInitialRemoteSettings();

  registerComponent();

  setClassComponent();

  initListeners();

  function setInitialGeneralSettings() {
    self.multiname = componentSettings.multiname || null;
    self.depend = componentSettings.depend || null;
    self.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
    self.defaultValue = componentSettings.defaultValue;
    self.placeholder = componentSettings.placeholder || null;
    self.classComponent = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 clear-padding-left';
    self.clientErrors = [];

    //validators
    self.typeInput = 'text';
    self.validators = self.setting.component.settings.validators;
    angular.forEach(self.setting.component.settings.validators, function(validator) {
      switch (validator.type) {
      case 'string':
        self.minLength = validator.minLength;
        self.maxLength = validator.maxLength;
        self.pattern = validator.pattern;
        self.trim = validator.trim;
        self.contentType = validator.contentType;
        break;
      case 'number':
        self.typeInput = 'number';
        self.minNumber = validator.min;
        self.maxNumber = validator.max;
        self.stepNumber = validator.step;
        break;
      case 'date':
        self.minDate = validator.minDate;
        self.maxDate = validator.maxDate;
        self.minView = validator.minView;
        self.maxView = validator.maxView;
        self.view = validator.view;
        self.format = validator.format || 'DD.MM.YYYY HH:mm:ss';
        break;
      case 'mask':
        self.isMask = true;
        self.maskDefinitions = validator.maskDefinitions;
        self.mask = validator.mask;
        break;
      }
    });
    if (self.defaultValue !== null && self.defaultValue !== undefined && self.defaultValue !== '') {
      let oldValue, newValue;
      oldValue = self.fieldValue;
      self.fieldValue = transformToValue(self.defaultValue);
      newValue = self.fieldValue;
      watcherValue(newValue, oldValue);
      equalPreviewValue();
    }

    if (self.multiple && (typeof self.fieldValue === 'undefined' || self.fieldValue === null)) {
      self.fieldValue = [];
    }

    if (self.options.filter) {
      self.readonly = false;
      self.required = false;
      self.options.isReady = true;
    }
  }

  // Initializes class of component according to width-setting in configuration.
  function setClassComponent() {
    self.isVisible = true;
    $timeout(function() {
      $element.closest('.component-wrapper').addClass('ue-compotent-stretch');
    });
    self.cols = self.width;

    if (self.options.filter) {
      self.cols = 12;
    }

    if (self.cols) {
      if (self.cols > 12) {
        self.cols = 12;
        $translate('ERROR.FIELD.MAX_SIZE').then(function(translation) {
          console.warn(translation.replace('%label_field', self.label));
        });
      }
      if (self.cols < 1) {
        self.cols = 1;
        $translate('ERROR.FIELD.MIN_SIZE').then(function(translation) {
          console.warn(translation.replace('%label_field', self.label));
        });
      }
      self.classComponent = 'col-lg-' + self.cols + ' col-md-' + self.cols + ' col-sm-' + self.cols + ' col-xs-' + self.cols + ' clear-padding-left';
    }
  }

  // Initializes parameters which is related with remote data
  function setInitialRemoteSettings() {
    values = componentSettings.values;
    remoteValues = componentSettings.valuesRemote;
    if (values || remoteValues) {
      self.fieldId = 'id';
      self.fieldSearch = 'title';
      if (remoteValues && remoteValues.fields) {
        self.fieldId = remoteValues.fields.value || self.fieldId;
        self.fieldSearch = remoteValues.fields.label || self.fieldId;
      }
      if (self.regim === 'preview') {
        self.initDataSource = false;
      }

      if (typeof self.serverPagination !== 'boolean') {
        self.serverPagination = componentSettings.serverPagination === true;
      }

      if (remoteValues) {
        componentSettings.valuesRemote.$selectedStorage = componentSettings.valuesRemote.$selectedStorage || [];
      } else if (values) {
        componentSettings.values.$selectedStorage = componentSettings.values.$selectedStorage || [];
      }
      if (!componentSettings.depend) {
        readRemotedData();
      }
    }
  }

  //-- Registration of the component in FilterFieldsStorage and EditEntityStorage services.
  function registerComponent() {
    if (self.options.filter) {
      FilterFieldsStorage.addFilterFieldController(self);
    } else {
      EditEntityStorage.addFieldController(self);
    }
  }

  // Adds handlers of component to the storage, which will be cleared if $destroy-event is called
  function initListeners() {
    if (componentSettings.depend) {
      self.tryAddListener(
        $scope.$on('ue:changeFieldValue', function(event, data) {
          self.onChangeFieldValue(event, data);
        })
      );
    }

    if (componentSettings.mode !== 'preview') {
      self.tryAddListener(
        $scope.$watch(() => self.fieldValue, watcherValue, true)
      );
    }
  }

  function onChangeFieldValue(event, data) {
    if (data.configuration.name === componentSettings.depend && self.regim !== 'preview') {
      let valuesRemote = data.configuration.component.settings.valuesRemote;
      self.dependValue = data.newValue;
      if (angular.isObject(self.dependValue) && valuesRemote && valuesRemote.fields.value) {
        self.dependValue = self.dependValue[valuesRemote.fields.value];
      }
      if (angular.isFunction(self.dependUpdate) && self.dependValue != data.oldValue) {
        self.dependUpdate(componentSettings.depend, self.dependValue);
      }
    }
  }

  // Sends request if settings of the component includes remoteValues-property and prepares data. Function formed and set promise in configuration.component.settings.$loadingPromise.
  function readRemotedData() {
    if (values || remoteValues) {
      if (self.optionValues) {
        if (values) {
          angular.forEach(componentSettings.values, function(v, key) {
            if (angular.isString(v)) {
              var obj = {};
              obj[self.fieldId] = key;
              obj[self.fieldSearch] = v;
              if (angular.isArray(componentSettings.values)) {
                obj[self.fieldId] = v;
              }
              self.optionValues.push(obj);
            }
          });
          componentSettings.$loadingPromise = $q.when(self.optionValues).then(onLoadedItems, onErrorLoadedItem);
        } else if (remoteValues) {
          if (self.initDataSource) {
            self.loadingData = true;
            self.loadingPossibleData = true;
            if ((!componentSettings.valuesRemote.$loadingPromise && !componentSettings.depend) || (componentSettings.depend && componentSettings.valuesRemote.$loadingPromise.$$state !== 0)) {
              var config = {
                method: 'GET',
                url: remoteValues.url,
                $id: self.setting.component.$id,
                serverPagination: self.serverPagination
              };
              var dataSource = $scope.getParentDataSource();
              config.standard = dataSource.standard;
              $rootScope.$broadcast('ue:beforeComponentDataLoaded', { $id: self.setting.component.$id });
              componentSettings.valuesRemote.$loadingPromise = ApiService
                .getUrlResource(config)
                .then(onLoadedItems, onErrorLoadedItem).finally(onLoadedItemFinally);
            } else {
              componentSettings.valuesRemote.$loadingPromise.then(onLoadedItems, onErrorLoadedItem).finally(onLoadedItemFinally);
              if (componentSettings.$optionValues && componentSettings.$optionValues.length) {
                self.loadingData = false;
                self.optionValues = componentSettings.$optionValues;
              }
            }
          } else {
            if (angular.isDefined(self.defaultValue) && angular.isFunction(self.loadDataById)) {
              self.loadDataById(self.defaultValue);
            }
          }
        }
      }
    }
  }

  // Uses as finally-callback after loading remoted data
  function onLoadedItemFinally() {
    self.loadingPossibleData = false;
    self.loadingData = false;
  }

  // Uses as error-callback after loading remoted data
  function onErrorLoadedItem() {
    $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
      console.error(self.fieldName ? (translation.replace('%name_field', 'для поля "' + self.fieldName + '"')) : (translation.replace('%name_field', '')));
    });
  }

  /**
   * Uses as success-callback after loading remoted data
   * @param {Object} response Answer of the server.
   */
  function onLoadedItems(response) {
    if (response) {
      if (response.hasOwnProperty('data')) {
        self.optionValues = [];
        angular.forEach(response.data.items, function(v) {
          self.optionValues.push(v);
        });
      } else {
        self.optionValues = response;
      }
      componentSettings.$optionValues = self.optionValues;
      if (angular.isFunction(self.fillControl)) {
        self.fillControl(self.optionValues);
      }
    }
    return self.optionValues;
  }

  /**
   * Handler of watcher on changing of component value.
   * @param {any} value New value of the component.
   * @param {any} oldValue Old value of the component which is changing.
   */
  function watcherValue(value, oldValue) {
    if (value !== oldValue) {
      $timeout(function() {
        $rootScope.$broadcast('ue:changeFieldValue', {
          configuration: self.setting,
          oldValue: oldValue,
          newValue: value
        });
      });
      if ((angular.isObject(componentSettings.handlers) && angular.isFunction(componentSettings.handlers.change) || angular.isFunction(componentSettings.change))) {
        (componentSettings.change || componentSettings.handlers.change)(value, oldValue, getExtendedValue(value));
      }
    }
    self.error = [];
    if (self.disabled === true) {
      self.isVisible = angular.isObject(value) ? checkForEmptyValue(value) : (value !== null && value !== undefined && value !== '');
    }
    var parameters = componentSettings.valuesRemote || componentSettings.values;

    /** logic for connected components */
    if (angular.isObject(parameters)) {
      var selected = parameters.$selectedStorage;
      if (selected) {
        if (angular.isArray(oldValue)) {
          oldValue.forEach(function(value) {
            let v = value;
            if (angular.isObject(value)) {
              v = value[self.fieldId];
            }
            let iOldValue = selected.indexOf(v);
            if (iOldValue !== -1) {
              selected.splice(iOldValue, 1);
            }
          });
        } else if (oldValue) {
          let v = oldValue;
          if (angular.isObject(oldValue)) {
            v = oldValue[self.fieldId];
          }
          let iOldValue = selected.indexOf(v);
          if (iOldValue !== -1) {
            selected.splice(iOldValue, 1);
          }
        }

        if (angular.isArray(value)) {
          value.forEach(function(value) {
            let v = value;
            if (angular.isObject(value)) {
              v = value[self.fieldId];
            }
            if (selected.indexOf(value) === -1) {
              selected.push(v);
            }
          });
        } else if (value) {
          let v = value;
          if (angular.isObject(value)) {
            v = value[self.fieldId];
          }
          if (selected.indexOf(v) === -1) {
            selected.push(v);
          }
        }
      }
    }
  }

  // Clears the value of the component.
  function clear() {
    self.fieldValue = self.multiple ? [] : null;
  }

  /**
   * Function for filling of previewValue. This value is displayed if the component has preview-regim.
   * @param {any} source Component data where the values must be taken for. For example, ue-dropdown calls this function with remoted data as argument.
   */
  function equalPreviewValue(source) {
    if (angular.isArray(self.fieldValue)) {
      self.previewValue = [];
    }
    if (self.fieldValue !== null && !angular.isUndefined(self.fieldValue)) {
      if ((componentSettings.values || componentSettings.valuesRemote)) {
        source = source || self.optionValues || [];
        if (source !== undefined && source !== null && !angular.isArray(source)) {
          source = [source];
        }
        if (angular.isArray(source)) {
          source.forEach(function(option) {
            if (angular.isObject(self.fieldValue) && !angular.isArray(self.fieldValue)) {
              compareId(self.fieldValue[self.fieldId], option, false);
            }
            if (angular.isArray(self.fieldValue)) {
              self.fieldValue.forEach(function(value) {
                if (angular.isObject(value)) {
                  compareId(value[self.fieldId], option, true);
                }
                if (angular.isNumber(value) || angular.isString(value)) {
                  compareId(value, option, true);
                }
              });
            }
            if (angular.isNumber(self.fieldValue) || angular.isString(self.fieldValue)) {
              compareId(self.fieldValue, option, false);
            }
          });
        }
      } else {
        self.previewValue = self.fieldValue;
      }
    }
    /**
     * Supported function for equalPreviewValue-method.
     * @param {number, string} id Some id
     * @param {Object} option The item of the data from which the value implemets
     * @param {boolean} multiple Flag of the plurality of previewValue
     */
    function compareId(id, option, multiple) {
      if (option && id == option[self.fieldId]) {
        if (multiple) {
          self.previewValue = self.previewValue || [];
          self.previewValue.push(option[self.fieldSearch]);
        } else {
          self.previewValue = option[self.fieldSearch];
        }
        if (angular.isArray(self.selectedValues) && !self.selectedValues.some((v) => v[self.fieldId] === option[self.fieldId])) {
          self.addToSelected(option);
        }
      }
    }
  }

  /**
   * Transforms the value to primitive value or item of the component data.
   * @param {any} object The value that we should transform
   * @param {boolean} isExtended Flag which tells us whether to return the data object or only the key
   * @returns any, null if value is empty, [] if value is empty and multiple.
   */
  function transformToValue(object, isExtended) {
    var value;
    if (componentSettings.$fieldType === 'date') {
      if (object) {
        if (self.multiple) {
          if (angular.isArray(object)) {
            value = [];
            object.forEach(function(date, index) {
              value[index] = date;
            });
          }
        } else {
          if (object) {
            value = object;
          }
        }
        return value;
      }
      return self.multiple ? [] : null;
    }
    if (angular.isObject(object) && !angular.isArray(object) && self.fieldId) {
      value = object[self.fieldId];
    } else {
      value = object;
    }
    if (value == 0) {
      return value;
    }
    if (isExtended === true) {
      value = getExtendedValue(value);
    }
    return angular.copy(value) || (self.multiple ? [] : null);
  }

  /**
   * Transforms the key to the item of the component data.
   * @param {string, number} id The value that we should transform
   * @returns any
   */
  function getExtendedValue(id) {
    var value = id;
    if (self.hasOwnProperty('fieldId') && remoteValues) {
      values = self.optionValues;
      if (angular.isArray(self.selectedValues)) {
        values = self.selectedValues;
      }
      if (angular.isArray(value)) {
        return self.selectedValues;
      }
      if (angular.isArray(values)) {
        value = values.filter(function(option) { return angular.isObject(option) ? (option[self.fieldId] == value) : false; })[0];
      }
    }
    return value;
  }

  /**
   * Gets value of the component according to isExtended-flag.
   * @param {boolean} isExtended Flag which tells us whether to return the data object or only the key
   * @returns object with format {<componentName>: <componentValue>}
   */
  function getFieldValue(isExtended) {
    var field = {},
      wrappedFieldValue;

    if (self.multiple) {
      wrappedFieldValue = [];
      angular.forEach(self.fieldValue, function(value) {
        var temp;
        var output = transformToValue(value, isExtended);

        if (self.multiname) {
          temp = {};
          temp[self.multiname] = output;
        }
        wrappedFieldValue.push(temp || output);
      });
    } else {
      wrappedFieldValue = transformToValue(self.fieldValue, isExtended);
      if (angular.isArray(wrappedFieldValue)) {
        wrappedFieldValue = wrappedFieldValue[0];
      }
    }
    field[self.fieldName] = wrappedFieldValue;
    if (angular.isArray(field[self.fieldName]) && field[self.fieldName].length === 0 || field[self.fieldName] === undefined || field[self.fieldName] === null) {
      field[self.fieldName] = '';
    }
    return field;
  }

  /**
   * Checks for empty value of the object. Empty value is '', undefined and null
   * @param {object} value Object that we check for empty value
   * @returns boolean
   */
  function checkForEmptyValue(value) {
    var result = false;
    if (value !== false) {
      (function check(value) {
        var keys = Object.keys(value);
        for (var i = keys.length; i--;) {
          var propValue = value[keys[i]];
          if (propValue !== null && propValue !== undefined && propValue !== '') {
            if (angular.isObject(propValue) && !result) {
              check(propValue);
            } else {
              result = true;
            }
          }
        }
      })(value);
    }
    return result;
  }

  /**
   * The handler which is used by children components for setting value. Subscribes to the scope-event ue:componentDataLoaded.
   * @param {object} data Data of the specified format
   * {
   *   componentId: 'fghf44fh-fgh4fgh-6fghf3g', It`s id of the current or parent component which is located in configuration.component.$id
   *   <componentName>: <componentValue>
   * }
   * @returns void
   */
  function onLoadDataHandler(event, data) {
    if (self.isParentComponent(data) && !self.options.filter) {
      if (data.editorEntityType === 'new' && self.regim !== 'preview') {
        if (self.newEntityLoaded) {
          self.newEntityLoaded();
          return;
        }
        if (componentSettings.defaultValue) {
          var obj = {};
          self.fieldValue = transformToValue(componentSettings.defaultValue);
          if (self.fieldId) {
            if (self.isTree) {
              self.fieldValue = [];
            }

            if (!!componentSettings.defaultValue && !self.isTree) {
              obj = {};
              obj[self.fieldId] = componentSettings.defaultValue;
              self.fieldValue = obj;
            }
            if (data.hasOwnProperty(self.fieldName)) {
              self.fieldValue = data[self.fieldName];
            }
          }
          equalPreviewValue();
        }
      }

      if (self.fieldName && data.hasOwnProperty(self.fieldName.split('.')[0].replace('[]', ''))) {
        let dataSource = $scope.getParentDataSource();
        if (dataSource && data.$dataSource && data.$dataSource.$hash === dataSource.$hash || data.$dataSource === false || dataSource === false || !data.hasOwnProperty('$dataSource')) {
          $scope.data = self.data = data;
          if (angular.isObject($scope.data)) {
            var apiValue;
            if (angular.isString(self.fieldName)) {
              var names = self.fieldName.split('.');
              var tempObject = self.data;
              var partName = '';
              angular.forEach(names, function(name, i) {
                if (angular.isObject(tempObject)) {
                  partName = partName ? (partName + '.' + name) : name;
                  if (name.lastIndexOf('[]') === (name.length - 2)) {
                    name = name.substr(0, name.length - 2);
                  }
                  if (angular.isArray(tempObject)) {
                    let component = self.getParentComponent(partName);
                    if (component) {
                      var parentIndex = component.parentFieldIndex || 0;
                      tempObject = tempObject[parentIndex];
                    }
                  }
                  if (tempObject) {
                    if (i !== (names.length - 1)) {
                      tempObject = tempObject[name];
                    } else {
                      apiValue = tempObject[name];
                    }
                  }
                }
              });
            }
            if (!self.multiple) {
              self.fieldValue = apiValue;
            } else {
              if (angular.isArray(apiValue)) {
                self.fieldValue = [];
                apiValue.forEach(function(item) {
                  self.fieldValue.push(self.multiname ? item[self.multiname] : item);
                });
              }
            }

            if (self.fieldId && self.fieldValue) {
              var output;
              if (angular.isArray(self.fieldValue)) {
                output = [];
                self.fieldValue.forEach(function(value) {
                  if (angular.isObject(value) && angular.isDefined(value[self.fieldId])) {
                    output.push(value[self.fieldId]);
                  } else if (!angular.isObject(value)) {
                    output.push(value);
                  }
                });
                if (output.length) {
                  self.fieldValue = output;
                }
              } else {
                if (angular.isObject(self.fieldValue) && angular.isDefined(self.fieldValue[self.fieldId])) {
                  self.fieldValue = self.fieldValue[self.fieldId];
                }
              }
            }

            var extended = remoteValues ? ApiService.getFromStorage(self.setting, self.multiname ? apiValue : self.fieldValue) : apiValue;
            if (extended !== false && self.regim === 'preview') {
              self.isSendRequest = true;
            }
            equalPreviewValue(extended);
          }
        }
      }
    }
  }

  /**
   * The handler of blur-event. It is used during validation.
   * @param {number, string} val Data of the specified format
   * @param {number} index Optional parameter. Index of the item if component has multiple value.
   * @returns void
   */
  function inputLeave(val, index) {
    var regEmail = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i'),
      regUrl = new RegExp('^(?:(?:ht|f)tps?://)?(?:[\\-\\w]+:[\\-\\w]+@)?(?:[0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(?::\\d{1,5})?(?:[?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?$', 'i');

    if (angular.isNumber(index)) {
      self.clientErrors[index] = [];
    } else {
      self.clientErrors = [];
    }

    if (!val) {
      return;
    }

    if (self.trim) {
      if (!self.multiple) {
        self.fieldValue = self.fieldValue.trim();
      } else {
        self.fieldValue[index] = self.fieldValue[index].trim();
      }
      val = val.trim();
    }

    function setClientError(error) {
      if (angular.isNumber(index)) {
        self.clientErrors[index] = self.clientErrors[index] || [];
        if (self.clientErrors[index].indexOf(error) < 0) {
          self.clientErrors[index].push(error);
        }
      } else {
        if (self.clientErrors.indexOf(error) < 0) {
          self.clientErrors.push(error);
        }
      }
    }

    if (self.hasOwnProperty('maxLength') && val.length > self.maxLength) {
      $translate('VALIDATION.STRING_MAX').then(function(translation) {
        setClientError(translation.replace('%maxLength', self.maxLength).replace('%val', val.length));
      });
    }

    if (self.hasOwnProperty('minLength') && val.length < self.minLength) {
      $translate('VALIDATION.STRING_MIN').then(function(translation) {
        setClientError(translation.replace('%minLength', self.minLength).replace('%val', val.length));
      });
    }

    if (self.hasOwnProperty('pattern') && !val.match(new RegExp(self.pattern))) {
      $translate('VALIDATION.INVALID_PATTERN').then(function(translation) {
        setClientError(translation.replace('%pattern', self.pattern.toString()));
      });
    }

    if (self.hasOwnProperty('maxNumber') && val > self.maxNumber) {
      $translate('VALIDATION.NUMBER_MAX').then(function(translation) {
        setClientError(translation.replace('%max', self.maxNumber).replace('%val', val));
      });
    }

    if (self.hasOwnProperty('minNumber') && val < self.minNumber) {
      $translate('VALIDATION.NUMBER_MIN').then(function(translation) {
        setClientError(translation.replace('%min', self.minNumber).replace('%val', val));
      });
    }

    if ((self.contentType == 'email') && !val.match(regEmail)) {
      $translate('VALIDATION.INVALID_IMAIL').then(function(translation) {
        setClientError(translation);
      });
      setClientError('Введен некорректный email.');
    }

    if ((self.contentType == 'url') && !val.match(regUrl)) {
      $translate('VALIDATION.INVALID_URL').then(function(translation) {
        setClientError(translation);
      });
    }
  }
}

export { FieldsController };
