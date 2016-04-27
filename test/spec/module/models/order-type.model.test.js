/*
jshint -W030
*/
(function() {
  'use strict';

  describe.only('OrderTypeModel Factory Unit Tests', function() {
      beforeEach(function() {
        module('openmrs-ngresource.models');
      });

      var orderTypeModelFactory;
      var orderTypeCreateVersionObject;
      var orderTypeUpdateVersionObject;
      var orderTypeGetVersionObject;
      var orderTypes;

      beforeEach(inject(function($injector) {
        orderTypeModelFactory = $injector.get('OrderTypeModel');
      }));
      
      beforeEach(inject(function($injector) {
        orderTypeCreateVersionObject = {
          name: 'name',
          description: 'description'
        };
        orderTypeUpdateVersionObject = orderTypeCreateVersionObject;
        orderTypeGetVersionObject = {
          uuid: 'uuid',
          display: 'display',
          name: 'name',
          description: 'description',
          retired: false
        };
        
         orderTypes = [
          orderTypeGetVersionObject
          , {
            uuid: 'uuid',
            display: 'display',
            name: 'name',
            description: 'description',
            retired: false
          }
        ];
        
        
      }));

      it('should have OrderType Model Factory defined', function() {
        expect(orderTypeModelFactory).to.exist;
      });

      it('should always create new order type model with minimum required members defined ', function() {
        var _name = 'display';
        var _description = 'familyName';

        var model = new orderTypeModelFactory.orderType(_name, _description);

        expect(model.name()).to.equal(_name);
        expect(model.description()).to.equal(_description);

      });

      it('should always create order type model that returns a valid openmrs create payload', 
      function() {

        var model = orderTypeModelFactory.toWrapper(orderTypeGetVersionObject);
        expect(model.getCreateVersion()).to.deep.equal(orderTypeCreateVersionObject);
      });
      
      it('should always create order type model that returns a valid openmrs update payload', 
      function() {

        var model = orderTypeModelFactory.toWrapper(orderTypeGetVersionObject);
        expect(model.getUpdateVersion()).to.deep.equal(orderTypeUpdateVersionObject);
      });
      
      it('should always create order type model that returns an openmrs get payload', 
      function() {

        var model = orderTypeModelFactory.toWrapper(orderTypeGetVersionObject);
        expect(model.getUpdateVersion()).to.deep.equal(orderTypeUpdateVersionObject);
      });

      it('should always have toWrapperArray create an array of order types models '+
      ' that returns a valid openmrs order types array payload', 
      function() {

        var models = orderTypeModelFactory.toArrayOfWrappers(orderTypes);

        for(var i = 0; i++; i< models.length){
          expect(models[i].fromWrapper()).to.deep.equal(orderTypes[i]);
        }

      });

      it('should always have fromArrayOfWrappers return an array of order'+
      ' type models that are valid openmrs order type payload', 
      function() {
       

        var models = orderTypeModelFactory.toArrayOfWrappers(orderTypes);

        var unwrappedModels = orderTypeModelFactory.fromArrayOfWrappers(models);

        for(var i = 0; i++; i< unwrappedModels.length){
          expect(unwrappedModels[i]).to.deep.equal(orderTypes[i]);
        }

      });

    });

})();
