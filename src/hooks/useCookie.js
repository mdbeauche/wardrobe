import { useState } from 'react';

// Usage (note: cookie values are stored and returned as strings)
/*
const MyComponent = () => {
  // useCookie(cookieName, initialValue)
  const [cookie, setCookie] = useCookie('username', 'defaultname');

  return (
    <>
      <span>{cookie}</span>
      <button
        type="button"
        onClick={() => {
          setCookie('updatedname', 10); // setCookie(newValue, daysToExpire)
        }}
      >
        Store Cookie
      </button>
    </>
  );
};
*/

const getStoredCookie = (key) =>
  document.cookie.split('; ').reduce((total, currentCookie) => {
    const item = currentCookie.split('=');
    const storedKey = item[0];
    const storedValue = item[1];

    return key === storedKey
      ? decodeURIComponent(storedValue)
      : total;
  }, '');

const setStoredCookie = (key, value, numberOfDays) => {
  const now = new Date();

  // set the time to be now + numberOfDays
  now.setTime(now.getTime() + numberOfDays * 60 * 60 * 24 * 1000);

  document.cookie = `${key}=${value}; expires=${now.toUTCString()}; path=/`;
};

const useCookie = (key, defaultValue) => {
  const getCookie = () => getStoredCookie(key) || defaultValue;
  const [cookie, setCookie] = useState(getCookie());

  const updateCookie = (value, numberOfDays = 1) => {
    setStoredCookie(key, value, numberOfDays);
    setCookie(value);
  };

  return [cookie, updateCookie];
};

export default useCookie;
