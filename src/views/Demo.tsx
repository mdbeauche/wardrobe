import Counter from '../components/Counter/Counter';

const Sandbox = () => (
  <>
    <a href="#main-content" className="sr-only sr-only-focusable">
      Skip to main content
    </a>
    {/* <Header /> */}
    <main id="main-content" role="main">
      <div className="App">
        <header className="App-header">
          <Counter />
        </header>
      </div>
    </main>
    {/* <Footer /> */}
  </>
);

export default Sandbox;
