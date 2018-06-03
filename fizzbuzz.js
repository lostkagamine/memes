/*
 * fizzbuzz in node.js i guess
 */

function fb(n) {
    let s = '';
    if (n % 3 === 0) s += 'Fizz';
    if (n % 5 === 0) s += 'Buzz';
    return s;
}

for (let i = 0; i < 100; i++) {
    console.log(fb(i) || i);
}