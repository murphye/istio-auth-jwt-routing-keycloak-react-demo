const { h, render } = preact;
const html = htm.bind(h);
const { useReducer } = preactHooks;
const { Router } = preactRouter;

function App() {
  return html`
    <div>
      <${Header} url=${this.state.url} />
      <${Router} onChange=${e => this.setState(e)}>
        <${Toggle} path="/" />
        <${Other} path="/other" />
      <//>
    </div>
  `;
}

const Header = ({ url }) => html`
  <h1>Hello</h1>
  <header style="max-width: 400px">
    <nav>
      <a href="/">Toggle</a>
      <a href="/other">Other Pag</a>
    </nav>
    
    <section>URL:<input readonly value=${url} /></section>
  </header>
`;

const TOGGLE = v => !v;
const Toggle = () => {
  const [on, toggle] = useReducer(TOGGLE, false);

  return html`
    <section>
      <h1>Toggle</h1>
      <strong>Value: ${on || "un"}checked</strong>
      <br />
      <label>
        <input type="checkbox" checked=${on} onClick=${toggle} />
        Check Me
      </label>
      <br />
      <p>
        Value toggles after initial pageload, but after nagivation it's
        broken...
      </p>
    </section>
  `;
};

const Other = () =>
  html`
    <style>
      h1 {color: blue;}
    </style>
    <section>
      <h1>Other</h1>
      <p>
        If you navigate to the Toggle Page, it will break its page's state
      </p>
    </section>
  `;

render(
  html`
    <${App} />
  `,
  document.body
);