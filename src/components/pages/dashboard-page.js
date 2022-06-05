class DashboardPage extends WebComponent {
  render () {
    return `
      <style>
        @import "stylesheets/dashboard-page.css"
      </style>

      <main>
        <header>
          <h3>Dashboard</h3>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliq Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </main>
    `
  }
}

window.customElements.define('dashboard-page', DashboardPage);
