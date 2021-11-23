import test from "ava";
import { h } from "preact";
import {render, fireEvent, screen} from "@testing-library/preact"
import ModwatchNav from "../../../src/components/modwatch-nav";

test.failing('loads items eventually', async (t) => {
  render(
    <ModwatchNav>
      <div>Hello</div>
    </ModwatchNav>
  )
  t.truthy(screen.getByRole('button', { name: 'menu-toggle' }));
});
