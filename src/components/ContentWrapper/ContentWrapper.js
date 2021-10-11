import React from "react";
// import PropTypes from "prop-types";
import { ViewportContext } from "../../context/ViewportContext";
// import Header from '../Header/Header';
// import Footer from '../Footer/Footer';
import Error from "../Error/Error";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    const { error } = this.state;

    if (error) {
      return <Error error={error.message} location={window.location} />;
    }

    const { children } = this.props;

    return children;
  }
}

const ContentWrapperInner = ({ children }) => {
  return (
    <>
      <a href="#main-content" className="sr-only sr-only-focusable">
        Skip to main content
      </a>
      {/* <Header /> */}
      <main id="main-content" role="main">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      {/* <Footer /> */}
    </>
  );
};

const ContentWrapper = ({ children }) => {
  return (
    <ViewportContext>
      <ContentWrapperInner>{children}</ContentWrapperInner>
    </ViewportContext>
  );
};

export default ContentWrapper;

// ErrorBoundary.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// ContentWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// ContentWrapperInner.propTypes = {
//   children: PropTypes.node.isRequired,
// };
