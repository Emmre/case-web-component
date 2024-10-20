import { LitElement, html } from 'lit-element';
import '../components/EmployeeForm';

export class EditPage extends LitElement {
  render() {
    return html` <employee-form .isEdit="${true}"></employee-form> `;
  }
}

customElements.define('edit-page', EditPage);
