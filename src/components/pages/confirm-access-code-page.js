class ConfirmAccessCodePage extends WebComponent {
  submitForm() {
    const accessCode = this.querySelector('input').value;

    window.api.confirmAccessCode(accessCode);
  }

  addEventListeners() {
    this.querySelector('form').onsubmit = (evt) => {
      evt.preventDefault()
      this.submitForm()
    }

    window.api.onConfirmAccessCodeSuccess(() => {
      window.location.hash = 'start-tracking';
    });
  }

  render () {
    return `
      <style>
        @import "stylesheets/confirm-access-code-page.css"
      </style>

      <main>
        <header>
          <h3>Enter your access code</h3>
        </header>

        <form>
          <input name="access-code" type="text" />
          <button>Confirm Access Code</button>
        </form>
      </main>
    `
  }
}

window.customElements.define('confirm-access-code-page', ConfirmAccessCodePage);
