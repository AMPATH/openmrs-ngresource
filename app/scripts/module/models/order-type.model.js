/*jshint -W003, -W098, -W117, -W026, -W040, -W004 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.models')
        .factory('OrderTypeModel', factory);

    factory.$inject = [];

    function factory() {
        var service = {
            orderType: orderType,
            toWrapper: toWrapper,
            toArrayOfWrappers: toArrayOfWrappers,
            fromArrayOfWrappers: fromArrayOfWrappers
        };

        return service;

        //madnatory fields givenName, familyName
        function orderType(name_, description_, display_, retired_, uuid_) {
            var modelDefinition = this;

            //initialize private members
            var _name = name_ ? name_ : '';
            var _description = description_ ? description_ : '';
            var _display = display_ ? display_ : '';
            var _retired = retired_ ? retired_ : false;
            var _uuid = uuid_ ? uuid_ : '';


            modelDefinition.name = function (value) {
                if (angular.isDefined(value)) {
                    _name = value;
                }
                else {
                    return _name;
                }
            };

            modelDefinition.description = function (value) {
                if (angular.isDefined(value)) {
                    _description = value;
                }
                else {
                    return _description;
                }
            };

            modelDefinition.display = function (value) {
                return _display;
            };

            modelDefinition.retired = function (value) {
                return _retired;
            };

            modelDefinition.uuid = function (value) {
                return _uuid;
            };

            modelDefinition.fromWrapper = function (value) {
                return {
                    uuid: _uuid,
                    display: _display,
                    name: _name,
                    description: _description,
                    retired: _retired
                };
            };

            modelDefinition.getCreateVersion = function (value) {
                return {
                    name: _name,
                    description: _description
                };
            };

            modelDefinition.getUpdateVersion = function (value) {
                return {
                    name: _name,
                    description: _description
                };
            };
        }

        function toWrapper(openmrsModel) {
            return new orderType(openmrsModel.name, openmrsModel.description, 
            openmrsModel.display, openmrsModel.retired, openmrsModel.uuid);
        }

        function toArrayOfWrappers(openmrsNameArray) {
            var array = [];
            for (var i = 0; i < openmrsNameArray.length; i++) {
                array.push(toWrapper(openmrsNameArray[i]));
            }
            return array;
        }

        function fromArrayOfWrappers(nameWrappersArray) {
            var array = [];
            for (var i = 0; i < nameWrappersArray.length; i++) {
                array.push(nameWrappersArray[i].fromWrapper());
            }
            return array;
        }
    }
})();
