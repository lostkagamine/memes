/*
 * FizzDeterminer for OOFB
 * @author ry00001
 */

class FizzDeterminer {
    constructor() {}
    determine(i) {
        let numbers = {
            3: 'Fizz',
            5: 'Buzz'
        }
        o = '';
        for (let j of Object.keys(numbers)) {
            if (j == i) o += numbers[j]
        }
        return o || i
    }
}