class StartTrackingPage extends WebComponent {
  addEventListeners () {
    this.querySelector('button').onclick = () => {
      window.api.startActivityTracking();
    }

    window.api.onStartActivityTrackingSuccess(() => {
      window.location.hash = 'dashboard';
    })
  }

  render() {
    return `
      <style>
        @import "stylesheets/start-tracking-page.css"
      </style>

      <main>
        <header>
          <h3>Confirm Activity Tracking</h3>
        </header>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliq Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>

        <div>
          <button>Start Tracking</button>
        </div>
      </main>
    `
  }
}

window.customElements.define('start-tracking-page', StartTrackingPage);
