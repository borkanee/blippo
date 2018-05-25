const template = document.createElement('template')
template.innerHTML = `
<input id="cityselector" placeholder="SEARCH CITY..." name="city" type="text" list="citylist">
<label class="active" for="cityselector"></label>
<datalist title="Choose a suggestion" id="citylist">
</datalist>
<style>
#cityselector:focus {
    outline:0 !important;
}
</style>
`

/**
 * Custom element for searching cities. (No shadowRoot-encapsulation due to datalist-polyfill not working)
 * 
 * @class CitySelector
 * @extends {window.HTMLElement}
 */
class CitySelector extends window.HTMLElement {
    constructor() {
        super()

        this.supportsDatalist = ('list' in document.createElement('input')) &&
            !!(document.createElement('datalist') && window.HTMLDataListElement)

        this.appendChild(template.content.cloneNode(true))

        this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1
        this.lengthLetters = this.supportsDatalist ? 5 : 2
        this._input = this.querySelector('#cityselector')

        this.cities = []
    }

    connectedCallback() {
        // If NOT native datalist is supported in browser, fetch small json file with only capitals.
        if (!this.supportsDatalist) {
            window.fetch('http://192.168.0.2:3000/api/capitals').then(res => res.json()).then(json => {
                this.cities = json.cities
                this._updateRendering()
            })
        }
        this._input.addEventListener('input', async e => {
            if (this._input.value.length < this.lengthLetters) {
                return
            }
            if (this.supportsDatalist) {
                this.cities = await this.search(this._input.value)
                this._updateRendering()
            }
            let hit = this.cities.filter(city => city.name === this._input.value).shift()
            if (hit) {
                this.dispatchEvent(new window.CustomEvent('selected', { detail: hit }))
                this._input.blur()
            }
        })
    }
    async search(str) {
        let res = await window.fetch(`http://192.168.0.2:3000/api/cities/?q=${str}`)
        res = await res.json()
        return res.cities
    }
    _updateRendering() {
        let cities = this.querySelector('#citylist')
        cities.innerHTML = ''
        for (let city of this.cities) {
            let option = document.createElement('option')
            option.textContent = this.isFirefox ? `${city.name} (${city.country})` : city.country
            option.setAttribute('value', city.name)
            cities.appendChild(option)
        }
    }
}

window.customElements.define('city-selector', CitySelector)