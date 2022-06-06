class AppRoute extends HTMLElement {
  connectedCallback() {
    const routeTo = this.getAttribute('to');
    const defaultRoute = this.getAttribute('root');
  }
}

window.customElements.define('app-route', AppRoute);
