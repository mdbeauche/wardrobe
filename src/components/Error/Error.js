import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
// import PropTypes from 'prop-types';
import Style from "./scss/ErrorPage.module.scss";

const Error = ({ error, location }) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCount) => {
        return prevCount - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    console.log(`Failed to load ${location.toString()}: ${error}`);
  }, []);

  if (countdown <= 0) {
    return (
      <Redirect
        to={{
          pathname: "/",
        }}
      />
    );
  }

  return (
    <div className={Style.Error}>
      <h1>Error</h1>
      <h2>Failed to load {location.toString()}:</h2>
      <pre>{error}</pre>
      <br />
      <h2>Redirecting in {countdown}...</h2>
      <br />
      <Link to="/">
        <button
          type="button"
          className={[Style.Button, Style.ButtonRed, Style.ButtonWide]
            .filter((c) => c)
            .join(" ")}
        >
          Return to Home
        </button>
      </Link>
    </div>
  );
};

export default Error;

// Error.propTypes = {
//   error: PropTypes.string.isRequired,
//   location: PropTypes.object.isRequired,
// };
