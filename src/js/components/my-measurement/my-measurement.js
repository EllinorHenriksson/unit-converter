/**
 * The my-measurement web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import helper from '../../helper'
import '../my-unit-selector'
import { MeasurementType } from '../../measurementType'

const DELETE = new URL('./images/delete.png', import.meta.url)

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
  #my-measurement {
    position: relative;
  }

  .invalid {
    background-color: red;
  }

  fieldset {
    border: 2px solid orange;
    border-radius: 5px;
    background-color: rgb(244, 238, 228);
    margin-left: 0;
    margin-right: 0;
  }

  legend {
    color: orange;
    font-weight: bold;
  }

  input {
    border: 1px solid orange;
    width: 100px;
  }

  input:focus {
    outline: 1px solid orange;
  }

  button {
    background: no-repeat center/80% url("${DELETE}");
    border: none;
    width: 20px;
    height: 20px;
    position: absolute;
    bottom: 10px;
    right: 10px;
  }

  button:hover, button:active {
    cursor: pointer;
  }
</style>

<div id="my-measurement">
  <fieldset>
    <legend>Measurement</legend>
    <label>Quantity: 
      <input type="text" name="quantity" value="0">
    </label>
    <my-unit-selector type="length"></my-unit-selector>
  </fieldset>
  <button></button>
</div>
`

customElements.define('my-measurement',
  /**
   * Represents a my-mesurement element.
   */
  class extends HTMLElement {
    /**
     * The measurement type.
     *
     * @type {MeasurementType}
     */
    #type

    /**
     * The quantity of the measurement.
     *
     * @type {number}
     */
    #quantity

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.#type = MeasurementType.LENGTH
      this.#quantity = 0

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Add event listeners.
      this.shadowRoot.querySelector('input').addEventListener('input', event => {
        this.#handleInput(event)
      })

      this.shadowRoot.querySelector('my-unit-selector').addEventListener('unitChange', event => {
        this.#handleUnitChange()
      })

      this.shadowRoot.querySelector('button').addEventListener('click', (event) => {
        event.preventDefault()
        this.#handleClick()
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['type']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'type' && newValue !== oldValue) {
        helper.validateMeasurementType(newValue)
        this.#type = newValue
        this.shadowRoot.querySelector('my-unit-selector').setAttribute('type', newValue)
      }
    }

    /**
     * Gets the quantity of the measurement.
     *
     * @returns {number} The quantity.
     */
    get quantity () {
      return this.#quantity
    }

    /**
     * Gets the unit of the measurement.
     *
     * @returns {string} The unit.
     */
    get unit () {
      return this.shadowRoot.querySelector('my-unit-selector').unit
    }

    /**
     * Handles input from the user by validating it, giving the user visual feedback, setting the quantity and dispatching a custom event.
     *
     * @param {InputEvent} event The event object.
     */
    #handleInput (event) {
      try {
        this.#validateInput(event.target.value)
        event.target.classList.remove('invalid')
        this.#quantity = Number(event.target.value)
        this.dispatchEvent(new window.CustomEvent('quantityInput', { bubbles: true }))
      } catch (error) {
        event.target.classList.add('invalid')
      }
    }

    /**
     * Validates input.
     *
     * @param {string} input The input.
     * @throws {Error} Throws an error if the input is not a number or if it is a negative number.
     */
    #validateInput (input) {
      const value = Number(input)
      if (isNaN(value) || value < 0) {
        throw new Error()
      }
    }

    /**
     * Handles the custom event unitChange from the unit selector by dispatching a new custom event.
     */
    #handleUnitChange () {
      this.dispatchEvent(new CustomEvent('unitChange', { bubbles: true }))
    }

    /**
     * Handles click events on the remove button by dispatching a custom event.
     */
    #handleClick () {
      this.dispatchEvent(new CustomEvent('removeMeasurement', { bubbles: true }))
    }
  }
)
