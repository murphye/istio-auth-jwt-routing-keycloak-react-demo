const { h, render } = preact;
const html = htm.bind(h);
const { useReducer } = preactHooks;

import { Switch, Route, Link, useRoute } from "wouter";

import "./styles.css";

const ActiveLink = props => {
  const [isActive] = useRoute(props.href);
  return (
    html`
      <Link {...props}>
        <a className=${isActive ? "active" : ""}>${props.children}</a>
      </Link>
    `
  );
};

function App() {
  return (
    html`
      <div className="App">
        <nav>
          <ActiveLink href="/">Home</ActiveLink>
          <ActiveLink href="/about">About Us</ActiveLink>
          <ActiveLink href="/faq">FAQ</ActiveLink>
        </nav>

        <main>
          <Switch>
            <Route path="/">Welcome!</Route>
            <Route path="/about">
              <article>
                <h1>How it all started?</h1>
                <p>
                  Injection stdio.h wannabee hexadecimal packet mainframe script
                  kiddies thread new gnu win emacs for fopen if cat Leslie
                  Lamport. Big-endian over clock hello world Starcraft firewall
                  machine code d00dz alloc perl. Flush class deadlock man pages
                  tera unix frack semaphore long server rsa suitably small values.
                </p>

                <p>
                  Mega wabbit firewall frack fork grep gobble false stdio.h
                  mainframe fail endif less Starcraft tera gcc blob back door void
                  float lib ack. Alloc try catch bypass null new access int double
                  wannabee stack mutex fatal dereference nak bit vi crack
                  semaphore. Bin continue gnu bytes case salt packet sniffer char
                  private bin infinite loop foad.
                </p>
              </article>
            </Route>
            <Route path="/:anything*">
              <center>
                <b>404:</b> Sorry, this page isn't ready yet!
              </center>
            </Route>
          </Switch>
        </main>
      </div>
  `);
}

render(
  html`
    <${App} />
  `,
  document.body
);