import DatabasePanel from '../components/Database/DatabasePanel';

const Sandbox = () => (
  <>
    <a href="#main-content" className="sr-only sr-only-focusable">
      Skip to main content
    </a>
    {/* <Header /> */}
    <main id="main-content" role="main">
      <DatabasePanel />
    </main>
    {/* <Footer /> */}
  </>
);

export default Sandbox;
