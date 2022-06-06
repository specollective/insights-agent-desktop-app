class DashboardPage extends WebComponent {
  render () {
    const isOnline = window.api.isOnline

    return `
      <style>
        @import "stylesheets/dashboard-page.css"
      </style>

      <main>
        <header>
          <h3>Dashboard</h3>
        </header>

        <p>Data collection in progress.</p>
      </main>
    `
  }
}

window.customElements.define('dashboard-page', DashboardPage);
