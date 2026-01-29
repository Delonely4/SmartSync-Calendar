export function sum(nums: number[]): number {
  let result = 0;
  for (let i = 0; i < nums.length; i++) {
    result = result + nums[i];
  }
  return result;
}

export function max(nums: number[]): number {
  if (nums.length === 0) {
    return 0;
  }
  let maxVal = nums[0];
  for (let i = 0; i < nums.length; i++) {
    if (maxVal < nums[i]) {
      maxVal = nums[i];
    }
  }
  return maxVal;
}

export function countChars(s: string): number {
  return s.length;
}

/**
 * Task 4: All even
 * Return true if all numbers in the array are even.
 */
export function allEven(nums: number[]): boolean {
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] % 2 !== 0) {
      return false;
    }
  }
  return true;
}

/**
 * Task 5: Reverse string
 * Return the reversed string.
 */
export function reverseString(s: string): string {
  let result = "";
  for (let i = s.length - 1; i >= 0; i--) {
    result += s[i];
  }
  return result;
}

/**
 * Task 6: Remove negative numbers
 * Return a new array without negative numbers.
 */
export function removeNegative(nums: number[]): number[] {
  let result: number[] = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) result.push(nums[i]);
  }
  return result;
}

/**
 * Task 7: Count words
 * Words are separated by spaces.
 * Return the number of words.
 */
export function countWords(s: string): number {
  return s.split(" ").length;
}

console.log(countWords("Serial killer asgardians"));

/**
 * Task 8: Frequency map
 * Count how many times each number appears.
 */
export function frequency(nums: number[]): Record<number, number> {
  let result: Record<number, number> = {};

  for (let i = 0; i < nums.length; i++) {
    if (result[nums[i]] === undefined) {
      result[nums[i]] = 1;
    } else {
      result[nums[i]] += 1;
    }
  }
  return result;
}

console.log(frequency([10, 20, 20, 20, 40]));

/**
 * Task 9: Contains element
 * Return true if target exists in the array.
 */
export function contains(nums: number[], target: number): boolean {
  for (let i = 0; i < nums.length; i++) {
    if (target === nums[i]) {
      return true;
    }
  }
  return false;
}

console.log(contains([2, 4, 5, 6, 3], 9));

/**
 * Task 10: Min and Max
 * Return minimum and maximum values from the array.
 */
export function minMax(nums: number[]): [number, number] {
  let minNumber: number = nums[0];
  let maxNumber: number = nums[0];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minNumber) {
      minNumber = nums[i];
    }
    if (nums[i] > maxNumber) {
      maxNumber = nums[i];
    }
  }

  return [minNumber, maxNumber];
}

console.log(minMax([3, 5, 2, 100, 4545]));

/**
 * Базовые типы
 * Функция принимает имя пользователя и его возраст.
 * Нужно вернуть строку вида:
 * "User Alex is 25 years old"
 */
function formatUserInfo(name: string, age: number): string {
  let result = `User ${name} is ${age} years old`;
  return result;
}

console.log(formatUserInfo("Dodo", 19));

// /**
//  * Булевы значения и условия
//  * Функция принимает число.
//  * Нужно вернуть true, если число чётное, иначе false.
//  */
function isEven(value: number): boolean {
  if (value % 2 === 0) {
    return true;
  } else {
    return false;
  }
}

console.log(isEven(5));

// /**
//  * Массивы
//  * Функция принимает массив чисел.
//  * Нужно вернуть сумму всех элементов массива.
//  */
function sumArray(values: number[]): number {
  let result = 0;
  for (let i = 0; i < values.length; i++) {
    result += values[i];
  }

  return result;
}

console.log(sumArray([50, 50, 23, 7]));

// /**
//  * Работа со строками
//  * Функция принимает строку.
//  * Нужно вернуть количество символов в строке.
//  * НЕ ИСПОЛЬЗУЙ .length()
//  */
function getStringLength(value: string): number {
  let i = 0;

  while (value[i] !== undefined) {
    i++;
  }

  return i;
}

console.log(getStringLength("Boby strong"));

// /**
//  * Union types (объединение типов)
//  * Функция принимает либо строку, либо число.
//  * Если это число — вернуть его в виде строки.
//  * Если это строка — вернуть её без изменений.
//  * Существует оператор - typeof
//  */
function normalizeToString(value: string | number): string {
  if (typeof value === "string") {
    return value;
  } else {
    return String(value);
  }
}

console.log(normalizeToString(50));

// /**
//  * Объекты и типизация
//  * Функция принимает объект пользователя с полями:
//  * - id (number)
//  * - email (string)
//  * Нужно вернуть email пользователя.
//  */
function getUserEmail(user: { id: number; email: string }): string {
  return user.email;
  // let result = user.email;
  // if (result !== "") {
  //   return result;
  // }
}

console.log(getUserEmail({ id: 44, email: "dadas@sdw" }));

// /**
//  * Опциональные поля
//  * Функция принимает объект пользователя:
//  * - name (string)
//  * - age (number, опционально)
//  * вернуть юзер
//  */
function formatUserAge(user: { name: string; age?: number }): string {
  if (user.age === undefined) {
    return user.name;
  }
  return `${user.name} ${user.age}`;
}

console.log(formatUserAge({ name: "Maria" }));

// /**
//  * Тип void
//  * Функция принимает сообщение и просто выводит его в консоль.
//  * Ничего не возвращает.
//  */
function logMessage(message: string): void {
  console.log(message);
}

logMessage("ffds");

// /**
//  * Enum
//  * Есть перечисление ролей пользователя.
//  * Функция принимает роль и возвращает описание роли.
//  */
// enum UserRole {
//   Admin,
//   User,
//   Guest,
// }

// function getRoleDescription(role: UserRole): string {
//   switch (role) {
//     case UserRole.Admin:
//       return "Администратор";
//     case UserRole.User:
//       return "Пользователь";
//     case UserRole.Guest:
//       return "Гость";
//   }
// }

// console.log(getRoleDescription(UserRole.User));

// /**
//  * Строки
//  * Функция принимает строку.
//  * Нужно вернуть эту строку в верхнем регистре.
//  */
function toUpperCase(value: string): string {
  return value.toUpperCase();
}

console.log(toUpperCase("mi razvivaemsya"));
// /**
//  * Условия
//  * Функция принимает число.
//  * Нужно вернуть строку:
//  * - "positive", если число > 0
//  * - "negative", если число < 0
//  * - "zero", если число равно 0
//  */
function getNumberSign(value: number): string {
  if (value > 0) {
    return "positive";
  } else if (value < 0) {
    return "negative";
  } else if (value === 0) {
    return "zero";
  }
}

console.log(getNumberSign(0));

// /**
//  * Работа с массивами
//  * Функция принимает массив строк.
//  * Нужно вернуть количество элементов в массиве.
//  */
function getArrayLength(values: string[]): number {
  return values.length;
}

console.log(getArrayLength(["Maximus", "forever", "young"]));

// /**
//  * Поиск в массиве
//  * Функция принимает массив чисел и число для поиска.
//  * Нужно вернуть true, если число есть в массиве, иначе false.
//  */
function includesNumber(values: number[], target: number): boolean {
  for (let i = 0; i < values.length; i++) {
    if (target === values[i]) {
      return true;
    }
  }
  return false;
}

console.log(includesNumber([34, 4, 5, 4], 4));

// /**
//  * Объекты
//  * Функция принимает объект с полями:
//  * - title (string)
//  * - completed (boolean)
//  *
//  * Нужно вернуть true, если completed === true.
//  */
function isTaskCompleted(task: { title: string; completed: boolean }): boolean {
  if (task.completed === true) {
    return true;
  } else {
    return false;
  }
}

console.log(isTaskCompleted({ title: "N word", completed: true }));

// /**
//  * Опциональные параметры
//  * Функция принимает имя пользователя и опциональный возраст.
//  * Нужно вернуть строку:
//  * - "Alex (25)", если возраст передан
//  * - "Alex", если возраст не передан
//  */
function formatUser(name: string, age?: number): string {
  if (age === undefined) {
    return name;
  } else {
    return `${name} (${age})`;
  }
}

console.log(formatUser("Zoro", 44));

// /**
//  * Union types
//  * Функция принимает значение типа number | null.
//  * Нужно вернуть:
//  * - число, если оно не null
//  * - 0, если значение null
//  * Существует оператор - typeof
//  */
function normalizeNumber(value: number | null): number {
  if (typeof value === null) {
    return 0;
  } else {
    return Number(value);
  }
}

console.log(normalizeNumber(null));

// /**
//  * Literal types
//  * Функция принимает статус запроса:
//  * - "loading"
//  * - "success"
//  * - "error"
//  * Нужно вернуть человеко-читаемое сообщение для каждого статуса.
//  */
function getRequestStatusMessage(
  status: "loading" | "success" | "error",
): string {
  switch (status) {
    case "loading":
      return "Идёт загрузка";
    case "success":
      return "Успешно выполненно";
    case "error":
      return "Ошибка при выполнении";
  }
}

console.log(getRequestStatusMessage("success"));

// /**
//  * Enum
//  * Есть перечисление направлений движения.
//  * Функция принимает направление и возвращает строку:
//  * - "Moving up"
//  * - "Moving down"
//  * - "Moving left"
//  * - "Moving right"
//  */
enum Direction {
  Up,
  Down,
  Left,
  Right,
}

function getMoveDescription(direction: Direction): string {
  switch (direction) {
    case Direction.Up:
      return "Moving up";
    case Direction.Down:
      return "Moving down";
    case Direction.Left:
      return "Moving left";
    case Direction.Right:
      return "Moving right";
  }
}

console.log(getMoveDescription(Direction.Right));

// /**
//  * Массив объектов
//  * Функция принимает массив пользователей.
//  * Каждый пользователь имеет поля:
//  * - id (number)
//  * - name (string)
//  * Нужно вернуть массив имён пользователей.
//  */
function getUserNames(users: { id: number; name: string }[]): string[] {
  let names = [];
  for (let i = 0; i < users.length; i++) {
    names.push(users[i].name);
  }
  return names;
}

console.log(
  getUserNames([
    { id: 12, name: "Ara" },
    { id: 11, name: "Egg" },
  ]),
);
