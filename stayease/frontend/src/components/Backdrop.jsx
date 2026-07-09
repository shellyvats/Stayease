// Renders the app-wide subtle backdrop (soft gradient blobs + faint grid).
// Kept as its own component so it's easy to swap/tune independently of layout.
const Backdrop = () => <div className="app-backdrop" aria-hidden="true" />;

export default Backdrop;
