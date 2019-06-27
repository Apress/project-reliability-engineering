a = [];
console.log(a[1]); // > undefined
a[3] = 3.14;       // out of bounds? not a problem
console.log(a);    // > [ <3 empty items>, 3.14 ]
b = 5 / 0;
console.log(b);   // > Infinity
