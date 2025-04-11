
/**
 * Determines whether a given number is prime.
 *
 * A prime number is a number greater than 1 that has no positive divisors
 * other than 1 and itself. This function checks for divisibility by testing
 * factors up to the square root of the number.
 *
 * @param {number} n - The number to check for primality.
 * @returns {boolean} - Returns true if n is a prime number, false otherwise.
 */
export function isPrimeNumber(n: number): boolean {
  // Any number less than or equal to 1 is not prime.
  if (n <= 1)
    return false

  // 2 is the only even prime number.
  if (n === 2)
    return true

  // Eliminate even numbers greater than 2.
  if (n % 2 === 0)
    return false

  // Only check for factors up to the square root of n.
  const sqrt = Math.sqrt(n)
  for (let i = 3; i <= sqrt; i += 2) {
    if (n % i === 0)
      return false
  }

  return true
}


/**
 * Determines whether a given number is composite.
 *
 * A composite number is a positive integer greater than 1 that is not prime.
 * @param {number} n - The number to check for primality.
 * @returns {boolean} - Returns true if n is a prime number, false otherwise.
 */
export function isCompositeNumber(n: number): boolean {
  return !isPrimeNumber(n)
}


