class AppRouter extends HTMLElement {
  constructor () {
    super()

    this.routes = [...this.children];

    window.addEventListener('hashchange', (e) => {
      this.replaceChildren(this.currentRoute());
    });
  }

  connectedCallback() {
    this.innerHTML = '';

    this.replaceChildren(this.currentRoute())
  }

  currentRoute() {
    const currentHash = window.location.hash;
    const currentRoute = this.routes.find(route => route.getAttribute('to') === currentHash);

    if (!currentRoute) {
      return this.routes.find(route => route.getAttribute('root') === 'true');
    }

    return currentRoute;
  }
}

window.customElements.define('app-router', AppRouter);
