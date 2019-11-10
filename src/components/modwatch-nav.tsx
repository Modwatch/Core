import { h, Component } from "preact";

export default class ModwatchNav extends Component<
  {},
  {
    show: boolean;
  }
> {
  state = {
    show: false
  };
  toggleShow = () => {
    this.setState(({ show }) => ({
      show: !show
    }));
  };
  render() {
    return (
      <div class="menu-wrapper">
        <div class="menu-toggle" onClick={this.toggleShow}/>
        <nav onClick={this.toggleShow} class={this.state.show ? "menu-main menu-active" : "menu-main"}>
          {this.props.children}
          <span class="nav-block">Close</span>
        </nav>
      </div>
    );
  }
};
