const template = document.createElement('template')
template.innerHTML = `
<div>
<input id="cityselector" name="city" type="text" list="citylist">
<label class="active" for="cityselector"></label>
<datalist title="Choose a suggestion" id="citylist"></datalist>
</div>
`

class CitySelector extends window.HTMLElement {
    constructor() {
        super()

        this.supportsDatalist = ('list' in document.createElement('input')) &&
            !!(document.createElement('datalist') && window.HTMLDataListElement)

        this.appendChild(template.content.cloneNode(true))

        this.lengthLetters = this.supportsDatalist ? 5 : 2
        this._input = this.querySelector('#cityselector')

        this.cities = []
    }

    connectedCallback() {
        if (!this.supportsDatalist) {
            window.fetch('http://192.168.0.2:3000/api/capitals').then(res => res.json()).then(res => {
                this.cities = res.cities
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
            option.setAttribute('value', city.name)
            //option.text = `(${city.country}) Geo coords[${city.coord.lat},${city.coord.lon}]`
            cities.appendChild(option)
        }
    }
}

window.customElements.define('city-selector', CitySelector)