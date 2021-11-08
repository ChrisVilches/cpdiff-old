# Changelog

## 1.0.8 (Released on 2021/11/08)

Huge numbers are now supported. It was implemented using a subset of big float operations. Only the *comparison* (between two numbers) operation was needed though.

A string like `110101021021092102902309320323.32432432` would be considered a numeric string, and the comparison would be performed using strings, therefore the number has no length limit (other than your RAM memory). This is an improvement over the previous implementation which used normal numbers (i.e. `Number` type in Javascript), which made the comparison incorrect when the number was very large.

The conditions for a string to be considered numeric are:

* It has one or more numbers (separated by space). In this case the numbers are compared individually.
* All numbers in the list do not have `0` as their first digit (unless the number is just `0`).
* Allowed formats for each number in the string are for example `1.02`, `-2`, `123.00`, etc. Formats like `.11`, `2.`, etc. would make the string decay to raw string.

The comparison using a precision error is still executed, such as `10213123123.123456 ≈ 10213123123.123457`. Since this comparison is also executed using strings, the amount of digits before and after the decimal point can be arbitrarily large.

In summary, it works as you would expect, handling infinitely big numbers and still doing the numerical comparison (i.e. using a precision error) when it can be handled.
