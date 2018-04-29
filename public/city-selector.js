const template = document.createElement('template')
template.innerHTML = `
<div class="input-field">
<input id="cityselector" type="text" list="cities">
<label class="active" for="cityselector"></label>
<datalist id="cities"></datalist>
`

class CitySelector extends window.HTMLElement {
    constructor() {
        super()

        this.attachShadow({ mode: 'open' })
        this.shadowRoot.appendChild(template.content.cloneNode(true))

        this._input = this.shadowRoot.querySelector('#cityselector')

        this.cities = []
    }

    connectedCallback() {
        this._input.addEventListener('input', async e => {
            if (this._input.value.length < 5) {
                return
            }
            this.cities = await this.search(this._input.value)

            this._updateRendering()

            let hit = this.cities.filter(city => city.name === this._input.value).shift()
            if (hit) {
                this.dispatchEvent(new window.CustomEvent('selected', { detail: hit }))
                this._input.blur()
            }
        })
    }
    async search(str) {
        let res = await window.fetch(`http://localhost:3000/api/cities/?q=${str}`)
        res = await res.json()
        return res.cities
    }
    _updateRendering() {
        let cities = this.shadowRoot.querySelector('#cities')
        cities.innerHTML = ''
        for (let city of this.cities) {
            let option = document.createElement('option')
            option.setAttribute('value', city.name)
            cities.appendChild(option)
        }
    }
}

window.customElements.define('city-selector', CitySelector)