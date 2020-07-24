import { h } from "preact";
import { useState } from "preact/hooks";

export default (props) => {
  const [show, setShow] = useState(false);
  return (
    <div class="menu-wrapper">
      <div class="menu-toggle" onClick={e => setShow(!show)} />
      <nav
        onClick={e => setShow(!show)}
        class={show ? "menu-main menu-active" : "menu-main"}
      >
        {props.children}
        <span class="nav-block">Close</span>
      </nav>
    </div>
  );
}
