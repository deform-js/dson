var DSON = require('../'),
	expect = require('chai').expect;

function ObjectId(v) {
	this.value = v;
}

ObjectId.prototype.toJSON = function() {
	return this.value;
};




var TEST = {
	_id: new ObjectId('5372f1a2283fd7b567007766'),
	__t: 'PatientTreatment',
	__v: 1,
	appointment: {
		_id: new ObjectId('53bb68ae0847b477887ab471'),
		type: 'appointment',
		date: new Date('2014-01-01T01:01:01.001Z')
	},
	'consult-time': '20',
	created: new Date('2014-05-14T04:31:30.266Z'),
	patient: {
		_id: new ObjectId('5372f1a2283fd7b56700775f'),
		type: 'patient',
		meta: {
			name: {
				last: 'Burroughs',
				first: 'Harold',
				sortable: 'Harold Burroughs'
			},
			office: {
				_id: new ObjectId('5372f07b283fd7b567000189'),
				type: 'office',
				name: 'Bluhm Cardiovascular Institute Outpatient Clinic'
			}
		},
		unumber: 70764,
		status: 'active'
	},
	referring: {
		physician: {
			_id: new ObjectId('5372f0a6283fd7b5670032a1'),
			type: 'physician',
			name: {
				suffix: 'MD',
				last: 'Gualtieri',
				middle: 'C',
				first: 'Clarence',
				sortable: 'Clarence Gualtieri'
			}
		}
	},
	status: 'consultation-passed',
	treating: {
		physician: {
			_id: new ObjectId('5372f0b5283fd7b567004556'),
			type: 'physician',
			name: {
				suffix: 'MD',
				last: 'Moore',
				middle: 'M',
				first: 'Sarah',
				sortable: 'Sarah Moore'
			}
		},
		office: {
			_id: new ObjectId('5372f07b283fd7b567000108'),
			type: 'office',
			name: 'The Thomas E. Rardin Family Practice Center'
		}
	},
	treatment: {
		_id: new ObjectId('536acf76c2e6334a5a000a82'),
		type: 'procedure',
		name: 'Bronchial Thermoplasty'
	},
	type: 'patient-treatment',
	updated: new Date('2014-07-25T17:05:55.515Z'),
	phone_data: {
		caller: {
			_id: null,
			type: null
		},
		code: '48340',
		ts: new Date('2014-07-25T17:04:27.229Z')
	},
	tags: [
		'I bet'
	]
};

DSON.register('$oid', ObjectId, function(obj) {
	return obj.value;
}, {
	exclude: ['value']
});
// DSON.register('$date', Date, function(obj) {
// 	return obj.value;
// }, {
// 	exclude: ['value']
// });

describe('DSON', function(){

	describe('Sample Mongo Document', function() {
		var dson = DSON.stringify(TEST);
		// console.log(dson);
		var json = JSON.parse(dson);

		it('should stringify `_id` to $oid', function() {
			expect(json._id.$oid).to.equal(TEST._id.value);
		});
		it('should stringify `appointment._id` to $oid', function() {
			expect(json.appointment._id.$oid).to.equal(TEST.appointment._id.value);
		});
		it('should stringify `appointment.date` to $date', function() {
			expect(json.appointment.date.$date).to.equal(TEST.appointment.date.getTime());
		});
		it('should stringify `created` to $date', function() {
			expect(json.created.$date).to.equal(TEST.created.getTime());
		});
		it('should stringify `patient._id` to $oid', function() {
			expect(json.patient._id.$oid).to.equal(TEST.patient._id.value);
		});
		it('should stringify `patient.meta.office._id` to $oid', function() {
			expect(json.patient.meta.office._id.$oid).to.equal(TEST.patient.meta.office._id.value);
		});
		it('should stringify `referring.physician._id` to $oid', function() {
			expect(json.referring.physician._id.$oid).to.equal(TEST.referring.physician._id.value);
		});
		it('should stringify `treating.physician._id` to $oid', function() {
			expect(json.treating.physician._id.$oid).to.equal(TEST.treating.physician._id.value);
		});
		it('should stringify `treating.office._id` to $oid', function() {
			expect(json.treating.office._id.$oid).to.equal(TEST.treating.office._id.value);
		});
		it('should stringify `treatment._id` to $oid', function() {
			expect(json.treatment._id.$oid).to.equal(TEST.treatment._id.value);
		});
		it('should stringify `updated` to $date', function() {
			expect(json.updated.$date).to.equal(TEST.updated.getTime());
		});
		it('should stringify `phone_data.ts` to $date', function() {
			expect(json.phone_data.ts.$date).to.equal(TEST.phone_data.ts.getTime());
		});



		var val = DSON.parse(dson);

		it('should reconstruct `_id` to an ObjectId', function() {
			expect(val._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `appointment._id` to an ObjectId', function() {
			expect(val.appointment._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `appointment.date` to a Date', function() {
			expect(val.appointment.date instanceof Date).to.equal(true);
		});
		it('should reconstruct `created` to a Date', function() {
			expect(val.created instanceof Date).to.equal(true);
		});
		it('should reconstruct `patient._id` to an ObjectId', function() {
			expect(val.patient._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `patient.meta.office._id` to an ObjectId', function() {
			expect(val.patient.meta.office._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `referring.physician._id` to an ObjectId', function() {
			expect(val.referring.physician._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `treating.physician._id` to an ObjectId', function() {
			expect(val.treating.physician._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `treating.office._id` to an ObjectId', function() {
			expect(val.treating.office._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `treatment._id` to an ObjectId', function() {
			expect(val.treatment._id instanceof ObjectId).to.equal(true);
		});
		it('should reconstruct `updated` to a Date', function() {
			expect(val.updated instanceof Date).to.equal(true);
		});
		it('should reconstruct `phone_data.ts` to a Date', function() {
			expect(val.phone_data.ts instanceof Date).to.equal(true);
		});


	});




	
});