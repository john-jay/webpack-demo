require('./styles.scss');

class Car {
    manufacturer(car) {
        document.write(`I have a ${car}.`);    
    }
}

const car = new Car;

car.manufacturer('Chrysler');