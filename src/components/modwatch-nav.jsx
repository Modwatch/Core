//@ts-check
import { h } from "preact";
import { useState } from "preact/hooks";

function ModwatchNav({
  children
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="menu-wrapper">
      <div role="button" name="menu-toggle" className="menu-toggle" onClick={() => setShow(!show)} />
      <nav
        onClick={() => setShow(!show)}
        class={show ? "menu-main menu-active" : "menu-main"}
      >
        {children}
        <span className="nav-block">Close</span>
      </nav>
    </div>
  );
}

export default ModwatchNav;
