import { css, define } from 'uce'

define('rui-icon', {
  style: (selector) => css`
    ${selector} {
      --size: var(--space-3);
      display: flex;
      fill: none;
      height: var(--size);
      stroke: currentColor;
      stroke-width: var(--px-2);
      stroke-linecap: round;
      stroke-linejoin: round;
      width: var(--size);
    }
  `,
  observedAttributes: ['name'],
  attributeChanged () {
    this.connected()
  },
  connected () {
    const name = this.getAttribute('name')
    const href = `/icons.svg#${name}`
    this.html`
      <svg aria-hidden='true'>
        <use href=${href}></use>
      </svg>
    `
  }
})
