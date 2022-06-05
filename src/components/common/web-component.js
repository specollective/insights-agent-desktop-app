class WebComponent extends HTMLElement {
  connectedCallback () {
    this.renderHTML()
    this.addEventListeners()
  }

  renderHTML () {
    this.innerHTML = this.render();
  }

  addEventListeners () {}
}
