'use strict';

//list of cars
//useful for ALL exercises
var cars = [{
    'id': 'p306',
    'vehicule': 'peugeot 306',
    'pricePerDay': 20,
    'pricePerKm': 0.10
}, {
    'id': 'rr-sport',
    'pricePerDay': 60,
    'pricePerKm': 0.30
}, {
    'id': 'p-boxster',
    'pricePerDay': 100,
    'pricePerKm': 0.45
}];


//list of rentals
//useful for ALL exercises
//The `price` is updated from exercice 1
//The `commission` is updated from exercice 3
//The `options` is useful from exercice 4
var rentals = [{
    'id': '1-pb-92',
    'driver': {
        'firstName': 'Paul',
        'lastName': 'Bismuth'
    },
    'carId': 'p306',
    'pickupDate': '2016-01-02',
    'returnDate': '2016-01-02',
    'distance': 100,
    'options': {
        'deductibleReduction': false
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'assistance': 0,
        'drivy': 0
    }
}, {
    'id': '2-rs-92',
    'driver': {
        'firstName': 'Rebecca',
        'lastName': 'Solanas'
    },
    'carId': 'rr-sport',
    'pickupDate': '2016-01-05',
    'returnDate': '2016-01-09',
    'distance': 300,
    'options': {
        'deductibleReduction': true
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'assistance': 0,
        'drivy': 0
    }
}, {
    'id': '3-sa-92',
    'driver': {
        'firstName': ' Sami',
        'lastName': 'Ameziane'
    },
    'carId': 'p-boxster',
    'pickupDate': '2015-12-01',
    'returnDate': '2015-12-15',
    'distance': 1000,
    'options': {
        'deductibleReduction': true
    },
    'price': 0,
    'commission': {
        'insurance': 0,
        'assistance': 0,
        'drivy': 0
    }
}];

//list of actors for payment
//useful from exercise 5
var actors = [{
    'rentalId': '1-pb-92',
    'payment': [{
        'who': 'driver',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'assistance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'drivy',
        'type': 'credit',
        'amount': 0
    }]
}, {
    'rentalId': '2-rs-92',
    'payment': [{
        'who': 'driver',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'assistance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'drivy',
        'type': 'credit',
        'amount': 0
    }]
}, {
    'rentalId': '3-sa-92',
    'payment': [{
        'who': 'driver',
        'type': 'debit',
        'amount': 0
    }, {
        'who': 'owner',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'insurance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'assistance',
        'type': 'credit',
        'amount': 0
    }, {
        'who': 'drivy',
        'type': 'credit',
        'amount': 0
    }]
}];

//list of rental modifcation
//useful for exercise 6
var rentalModifications = [{
    'rentalId': '1-pb-92',
    'returnDate': '2016-01-04',
    'distance': 150
}, {
    'rentalId': '3-sa-92',
    'pickupDate': '2015-12-05'
}];

//====================================================
// START OF EXERCICES
//====================================================

var DEDUCTIBLE_COST = 4;    // cost per day for deductible reduction


// return the number of days between 2 dates
function calcDays(dateStart, dateEnd) {
    var d1 = new Date(dateStart);
    var d2 = new Date(dateEnd);
    return d2.getDate() - d1.getDate() + 1;
}


function RentalPrice(rental) {
    var timeCost = 0;
    var distCost = 0;
    var addCost = 0;
    var days = calcDays(rental.pickupDate, rental.returnDate);
    // find the car in array
    var car = cars.find(function (c) { if (c.id === rental.carId) return c; });
    if (car != null) {
        var ppd = car.pricePerDay;
        if (days > 10) ppd *= 0.5;
        else if (days > 4) ppd *= 0.7;
        else if (days > 1) ppd *= 0.9;
        timeCost = ppd * days;
        distCost = car.pricePerKm * rental.distance;
        // check for additional charge, 4€ / day
        if (rental.options.deductibleReduction) {
            addCost = days * DEDUCTIBLE_COST;
        }
    }
    rental.price = timeCost + distCost + addCost;
}


function createCommission(rental) {
    // calculates parts of commission
    var price = rental.price;
    var addCost = 0;
    var days = calcDays(rental.pickupDate, rental.returnDate);
    if (rental.options.deductibleReduction) {
        // calc add cost for drivy
        addCost = days * DEDUCTIBLE_COST;
        // dont count add cost into commission
        price -= addCost;
    }
    var com = price * 0.3;
    var ins = com / 2;
    var ass = days * 1; // 1€ per day
    var dri = com - ins - ass + addCost;
    rental.commission = { 'insurance': ins, 'assistance': ass, 'drivy': dri };
}


// parse array for calculate each rental price
rentals.forEach(function (rental) {
    RentalPrice(rental);
    createCommission(rental);
});


actors.forEach(function (act) {
    var rental = rentals.find(function (r) { if (r.id === act.rentalId) return r; });
    if (rental != null) {
        act.payment.forEach(function (pay) {
            switch (pay.who) {
                case 'driver':
                    pay.amount = rental.price;
                    break;
                case 'owner':
                    pay.amount = rental.price - rental.commission.insurance - rental.commission.assistance - rental.commission.drivy;
                    break;
                case 'drivy':
                case 'insurance':
                case 'assistance':
                    pay.amount = rental.commission[pay.who];
                    break;
                default:
                    // should not pass here
                    alert('payment for ' + pay.who + ' ? error !');
                    break;
            }
        });
    }
});
//====================================================

console.log(cars);
console.log(rentals);
console.log(actors);
console.log(rentalModifications);

