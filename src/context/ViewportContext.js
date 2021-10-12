import { createContext, useContext, useState, useEffect } from 'react';

const getWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth;

const getHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

const viewportContext = createContext({});

export const ViewportContext = ({ children }) => {
  const [width, setWidth] = useState(getWidth());
  const [height, setHeight] = useState(getHeight());

  useEffect(() => {
    // timeoutId for debounce mechanism
    let timeoutId = null;

    const handleWindowResize = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);

      // change width from the state object after 250ms
      timeoutId = setTimeout(() => {
        setWidth(getWidth());
        setHeight(getHeight());
      }, 250);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <viewportContext.Provider value={{ width, height }}>
      {children}
    </viewportContext.Provider>
  );
};

export const useViewport = () => {
  const { width, height } = useContext(viewportContext);
  return { width, height };
};
