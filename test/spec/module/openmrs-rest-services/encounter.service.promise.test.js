/*
jshint -W026, -W116, -W098, -W003, -W068, -W004, -W033, -W030, -W117
*/
(function() {
  'use strict'

  describe('Open MRS Encounter Service Unit Tests', function() {
    beforeEach(function() {
      module('openmrs-ngresource.restServices');
    });

    var testRestUrl ='https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/'
    var httpBackend;
    var encounterResService;
    var OpenmrsSettings;
    var dummyEncounter = {
      uuid: 'encounter-test-uuid',
      patient: {
        uuid: 'test-patient-uuid'
      }
    }

    var dummyResponse = {
      'results': [{
        'uuid': 'encounter-uuid-for-first-element',
        'display': 'ADULTRETURN 01/02/2006',
      }, {
        'uuid': 'bf218490-1691-11df-97a5-7038c432aabf',
        'display': 'ADULTRETURN 07/02/2006',
        'links': [{
          'uri': testRestUrl + 'encounter/bf218490-1691-11df-97a5-7038c432aabf',
          'rel': 'self'
        }]
      }]
    }

    beforeEach(inject(function($injector) {
      httpBackend = $injector.get('$httpBackend');
      encounterResService = $injector.get('EncounterResService');
      OpenmrsSettings = $injector.get('OpenmrsSettings');

      //  Set restangular URL
      $injector.get('Restangular').setBaseUrl(testRestUrl);
      OpenmrsSettings.setCurrentRestUrlBase(testRestUrl);
    }));

    afterEach(function() {
      httpBackend.verifyNoOutstandingExpectation();
    });

    it('Should have encounter service defined', function() {
      expect(encounterResService).to.exists;
    });

    it('Should call the appropriate rest end point when getEncounterByUuid is called', function() {
      var customDefaultRep = 'custom:(uuid,encounterDatetime,' +
        'patient:(uuid,uuid,identifiers),form:(uuid,name),' +
        'location:ref,encounterType:ref,provider:ref,orders:full,' +
        'obs:(uuid,obsDatetime,concept:(uuid,uuid,name:(display)),value:ref,groupMembers))';
      httpBackend.expectGET(testRestUrl + 'encounter/encounter-test-uuid?v=' +
        customDefaultRep).respond(dummyEncounter);
      encounterResService.getEncounterByUuid('encounter-test-uuid', function(data) {
        expect(data.uuid).to.equal(dummyEncounter.uuid);
      });
      httpBackend.flush();
    });

    it('Should save new Encounter to the database', function() {

    });

    it('Should make a call to retrieve a list of encounters for a patient', function() {
      var customDefaultRep = 'custom:(uuid,encounterDatetime,' +
        'patient:(uuid,uuid),form:(uuid,name),' +
        'location:ref,encounterType:ref,provider:ref)';
      httpBackend.expectGET(testRestUrl + 'encounter?patient=patient-uuid&v=' +
        customDefaultRep).respond(dummyResponse);
      var promise = encounterResService.getPatientEncounters('patient-uuid');

      promise.then(function(data) {
        console.log(data);
        expect(data[1].uuid).to.equal('encounter-uuid-for-first-element');
      }).catch(function(error) {
        console.log('Error:', error)
      })

      httpBackend.flush();
    });

    it('getPatientEncounters should accept a params list object', function() {
      var params = {
        patientUuid: 'patient-uuid',
        rep: 'ref'
      };
      httpBackend.expectGET(testRestUrl + 'encounter?patient=patient-uuid&v=ref').respond(dummyResponse);
      encounterResService.getPatientEncounters(params, function(data) {
        expect(data[1].uuid).to.equal('encounter-uuid-for-first-element');
      }, function(error) {
        console.log('Error')
      });
      httpBackend.flush();
    });
    
    it('getEncounterTypes should return a promise to be fullfilled', function() {
      httpBackend.expectGET(testRestUrl + 'encountertype').respond({results:[{
        uuid: 'type-1-uuid',
        display: 'type-1'
      }, {
        uuid: 'type-2-uuid',
        display: 'type-2'
      }]});
      encounterResService.getEncounterTypes().then(function(data) {
        var types = data.results;
        expect(types).to.be.an.array;
      });
      httpBackend.flush();
    });
  });
})();
