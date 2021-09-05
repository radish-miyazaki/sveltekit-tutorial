// validationのロジックをまとめる
export const isEmpty = (val) => {
  return val.trim().length === 0;
}

// @see https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
export const isValidEmail = (val) => {
  return new RegExp(
    "[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
  ).test(val);
}