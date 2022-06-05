class AppMain extends WebComponent {
  constructor () {
    super();


    if (window.api.surveyToken) {
      window.location.hash = 'start-tracking';
    } else {
      window.location.hash = '';
    }
  }

  render () {
    return `
      <app-router>
        <app-route to="#send-access-code" root="true">
          <send-access-code-page />
        </app-route>

        <app-route to="#confirm-access-code">
          <confirm-access-code-page />
        </app-route>

        <app-route to="#start-tracking">
          <start-tracking-page />
        </app-route>

        <app-route to="#dashboard">
          <dashboard-page />
        </app-route>
      </app-router>
    `
  }
}

window.customElements.define('app-main', AppMain);
