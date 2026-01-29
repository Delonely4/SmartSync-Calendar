/**
//  * Task 4: All even
//  * Return true if all numbers in the array are even.
//  */
// export function allEven(nums) {
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] % 2 !== 0) {
//       return false;
//     }
//   }
//   return true;
// }

// /**
//  * Task 5: Reverse string
//  * Return the reversed string.
//  */
// export function reverseString(s) {
//   let result = "";
//   for (let i = s.length - 1; i >= 0; i--) {
//     result += s[i];
//   }
//   return result;
// }

// console.log(allEven([2, 2, 2]));

// console.log(reverseString("kcuf"));

// export function removeNegative(nums) {
//   let result = [];
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] > 0) result.push(nums[i]);
//   }
//   return result;
// }

// console.log(removeNegative([-4, 5, 6, -3]));

// export function countWords(s) {
//   return s.split(" ").length;
// }

// console.log(countWords("Serial killer asgardians"));

// export function stringToNumber(str) {
//   let result = Number(str);
//   return result;
// }

// console.log(stringToNumber("123123123"));

const hashMap = {
  key1: 2,
};

console.log(hashMap["key1"]);
