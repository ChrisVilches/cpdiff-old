# Changelog

## 1.0.8 (Released on 2021/11/08)

Huge numbers are now supported. It was implemented using a subset of big float operations. Only the *comparison* (between two numbers) operation was needed though.

Some examples of what would happen in each case:

A string like `110101021021092102902309320323.32432432` would be considered a numeric string, and the comparison would be performed using strings, therefore the number has no length limit (other than your RAM memory).

Binary strings like `1011101010010101010101` are considered numeric if they don't start with 0, and raw strings if they start with 0, but in any case, the comparison is performed using strings so it's exact.

The comparison using a precision error is still executed, and is also executed using strings, such as `10213123123.123456 ≈ 10213123123.123457`. The amount of digits before and after the decimal point can be arbitrarily large.

In summary, it works as you would expect, handling infinitely big numbers and still doing the numerical comparison (i.e. using a precision error) when it can be handled.
