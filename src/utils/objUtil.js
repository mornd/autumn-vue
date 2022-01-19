/**
 * 验证值是否是数组类型，并且长度大于0
 * @param arr
 * @returns {arg is Array<any> | boolean}
 */
export const arrNotEmpty = (arr) => {
  return (Array.isArray(arr) && arr.length !== 0);
}

/**
 * 根据生日计算年龄
 * @param birthday
 * @returns {number}
 */
export const birthdayToAge = (birthdayDate) => {
  let birthday = new Date(birthdayDate.replace(/-/g, "\/"))
  let curr = new Date()
  let age = curr.getFullYear()
            - birthday.getFullYear()
            - ((curr.getMonth() < birthday.getMonth()
            || curr.getMonth() == birthday.getMonth()
            && curr.getDate() < birthday.getDate()) ? 1 : 0)
  return age
}