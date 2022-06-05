class SendAccessCodePage extends WebComponent {
  submitForm() {
    const phoneNumber = this.querySelector('input').value;

    window.api.sendAccessCode(phoneNumber);
  }

  addEventListeners() {
    this.querySelector('form').onsubmit = (evt) => {
      evt.preventDefault()
      this.submitForm()
    }

    window.api.onSendAccessCodeSuccess(() => {
      window.location.hash = 'confirm-access-code';
    });
  }

  render() {
    return `
      <style>
        @import "stylesheets/send-access-code-page.css"
      </style>

      <main>
        <header>
          <h3>Enter your phone number</h3>
        </header>

        <form>
          <input name="phone-number-input" type="text" />
          <button type="submit">Send Access Code</button>
        </form>
      </main>
    `
  }
}

window.customElements.define('send-access-code-page', SendAccessCodePage);
