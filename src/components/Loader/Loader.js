import React from 'react';
import Style from './scss/Loader.module.scss';

const Loader = () => (
  <div className={Style.LoaderWrapper}>
    <div className="sr-only sr-only-focusable">Loading</div>
    <div className={Style.Loader} />
  </div>
);

export default Loader;
