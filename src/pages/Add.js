import { LitElement, html } from 'lit-element';
import '../components/EmployeeForm';

export class Add extends LitElement {
  render() {
    return html` <employee-form .isEdit="${false}"></employee-form> `;
  }
}

customElements.define('add-page', Add);
