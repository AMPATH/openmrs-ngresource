/*jshint -W003, -W098, -W117, -W026 */
(function () {
    'use strict';

    angular
        .module('openmrs-ngresource.restServices')
        .service('OrderResService', OrderResService);

    OrderResService.$inject = ['OpenmrsSettings', '$resource'];

    function OrderResService(OpenmrsSettings, $resource) {
        var serviceDefinition = {
            getResource: getResource,
            getFullResource: getFullResource,
            getOrderByUuid: getOrderByUuid,
            saveUpdateOrder: saveUpdateOrder,
            getOrdersByPatientUuid: getOrdersByPatientUuid,
            deleteOrder: deleteOrder
        };
        return serviceDefinition;

        function getResource() {
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'order/:uuid',
                { uuid: '@uuid' },
                { query: { method: 'GET', isArray: false } });
        }

        function getDeleteResource() {
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'order/:uuid?purge',
                { uuid: '@uuid' },
                { query: { method: 'GET', isArray: false } });
        }

        function getFullResource() {
            var v = 'full';
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'order/:uuid',
                { uuid: '@uuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getCustomResource(customResource) {
            if (customResource === false || customResource === undefined) return getResource();

            var v = customResource === undefined || customResource === true ?
                'custom:(display,uuid,orderNumber,accessionNumber,orderReason,orderReasonNonCoded,urgency,action,' +
                'commentToFulfiller,dateActivated,instructions,orderer:default,encounter:full,patient:default,concept:ref)' : customResource;
            return $resource(OpenmrsSettings.getCurrentRestUrlBase().trim() + 'order/:uuid',
                { uuid: '@uuid', v: v },
                { query: { method: 'GET', isArray: false } });
        }

        function getOrderByUuid(orderUuid, successCallback, failedCallback, customResource) {
            var resource = getCustomResource(customResource);
            return resource.get({ uuid: orderUuid }).$promise
                .then(function (response) {
                    successCallback(response);
                })
                .catch(function (error) {
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                    console.error(error);
                });
        }

        function getOrdersByPatientUuid(patientUuid, successCallback, failedCallback, customResource) {
            var resource = getCustomResource(customResource);
            return resource.get({ patient: patientUuid }).$promise
                .then(function (response) {
                    successCallback(response);
                })
                .catch(function (error) {
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                    console.error(error);
                });
        }

        function saveUpdateOrder(order, successCallback, failedCallback) {
            var orderResource = getResource();
            var _obs = order;
            if (order.uuid !== undefined) {
                //update obs
                var uuid = order.uuid;
                delete order['uuid'];
                console.log('Stringified order', JSON.stringify(order));
                return orderResource.save({ uuid: uuid }, JSON.stringify(order)).$promise
                    .then(function (data) {
                        successCallback(data);
                    })
                    .catch(function (error) {
                        console.error('An error occured while saving the order ', error);
                        if (typeof failedCallback === 'function')
                            failedCallback('Error processing request', error);
                    });
            }

            orderResource = getResource();
            return orderResource.save(order).$promise
                .then(function (data) {
                    successCallback(data);
                })
                .catch(function (error) {
                    console.error('An error occured while saving the order ', error);
                    if (typeof failedCallback === 'function')
                        failedCallback('Error processing request', error);
                });

        }

        function deleteOrder(order, successCallback, failedCallback) {
            var resource = getDeleteResource();
            return resource.delete({ uuid: order.uuid }).$promise
                .then(function (response) {
                    successCallback(response);
                })
                .catch(function (error) {
                    failedCallback('Error processing request', error);
                    console.error(error);
                });
        }
    }
})();
