window.customCards = window.customCards || [];
window.customCards.push({
  type: "light-brightness-preset-row",
  name: "light brightness preset row",
  description: "A plugin to display your light controls in a button row.",
  preview: false,
});

const LitElement = customElements.get("ha-panel-lovelace") ? Object.getPrototypeOf(customElements.get("ha-panel-lovelace")) : Object.getPrototypeOf(customElements.get("hc-lovelace"));
const html = LitElement.prototype.html;
const css = LitElement.prototype.css;

class CustomLightBrightnessRow extends LitElement {

	constructor() {
		super();
		this._config = {
			customTheme: false,
			customSetpoints: false,
			reverseButtons: false,
			width: '30px',
			height: '30px',
			lowBrightness: 43,
			lowmedBrightness: 100,
			medBrightness: 128,
			medhiBrightness, 200,
			hiBrightness: 213,
			isOffColor: '#f44c09',
			isOnLowColor: '#43A047',
			isOnLowMedColor: '#43A047',
			isOnMedColor: '#43A047',
			isOnMedHiColor: '#43A047',
			isOnHiColor: '#43A047',
			buttonInactiveColor: '#759aaa',
			customOffText: 'OFF',
			customLowText: 'LOW',
			custonLowMedText: 'LOWMED',
			customMedText: 'MED',
			custonMedHiText: 'MEDHI',
			customHiText: 'HIGH',
		};
	}
	
	static get properties() {
		return {
			hass: Object,
			_config: Object,
			_stateObj: Object,
			_lowSP: Number,
			_lowmedSP: Number,
			_medSP: Number,
			_medhighSP: Number,
			_highSP: Number,
			_width: String,
			_height: String,
			_lowColor: String,
			_lowmedColor: String,
			_medColor: String,
			_medhiColor: String,
			_hiColor: String,
			_offColor: String,
			_lowText: String,
			_lowmedText: String,
			_medText: String,
			_medhiText: String,
			_hiText: String,
			_offText: String,
			_lowName: String,
			_lowmedName: String,
			_medName: String,
			_medhiName: String,
			_hiName: String,
			_offName: String,
			_lowState: Boolean,
			_medlowState: Boolean,
			_medState: Boolean,
			_medhighState: Boolean,
			_highState: Boolean,
			_offState: Boolean,
		};
	}

	static get styles() {
		return css`
			:host {
				line-height: inherit;
			}
			.box {
				display: flex;
				flex-direction: row;
			}
			.brightness {
				margin-left: 2px;
				margin-right: 2px;
				background-color: #759aaa;
				border: 1px solid lightgrey; 
				border-radius: 4px;
				font-size: 10px !important;
				color: inherit;
				text-align: center;
				float: left !important;
				padding: 1px;
				cursor: pointer;
			}
		`;
	}
	
	render() {
		return html`
			<hui-generic-entity-row .hass="${this.hass}" .config="${this._config}">
				<div id='button-container' class='box'>
					<button
						class='brightness'
						style='${this._lowColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._lowName}"
						@click=${this.setBrightness}
						.disabled=${this._lowState}>${this._lowText}</button>
      					<button
						class='brightness'
						style='${this._lowmedColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._lowmedName}"
						@click=${this.setBrightness}
						.disabled=${this._lowmedState}>${this._lowmedText}</button>
      					<button
						class='brightness'
						style='${this._medColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._medName}"
						@click=${this.setBrightness}
						.disabled=${this._medState}>${this._medText}</button>
					<button
						class='brightness'
						style='${this._medhiColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._medhiName}"
						@click=${this.setBrightness}
						.disabled=${this._medhiState}>${this._medhiText}</button>
					<button
						class='brightness'
						style='${this._hiColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._hiName}"
						@click=${this.setBrightness}
						.disabled=${this._hiState}>${this._hiText}</button>
					<button
						class='brightness'
						style='${this._offColor};min-width:${this._width};max-width:${this._width};height:${this._height}'
						toggles name="${this._offName}"
						@click=${this.setBrightness}
						.disabled=${this._offState}>${this._offText}</button>
				</div>
			</hui-generic-entity-row>
		`;
	}
	
	firstUpdated() {
		super.firstUpdated();
		this.shadowRoot.getElementById('button-container').addEventListener('click', (ev) => ev.stopPropagation());
	}

	setConfig(config) {
		this._config = { ...this._config, ...config };
	}

	updated(changedProperties) {
		if (changedProperties.has("hass")) {
			this.hassChanged();
		}
	}
	
	hassChanged(hass) {

		const config = this._config;
		const stateObj = this.hass.states[config.entity];
		const custTheme = config.customTheme;
		const custSetpoint = config.customSetpoints;
		const revButtons = config.reverseButtons;
		const buttonWidth = config.width;
		const buttonHeight = config.height;
		const OnLowClr = config.isOnLowColor;
		const OnLowMedClr = config.isOnLowMedColor;
		const OnMedClr = config.isOnMedColor;
		const OnMedHiClr = config.isOnMedHiColor;
		const OnHiClr = config.isOnHiColor;
		const OffClr = config.isOffColor;
		const buttonOffClr = config.buttonInactiveColor;
		const LowSetpoint = config.lowBrightness;
		const LowMedSetpoint = config.lowmedBrightness;
		const MedSetpoint = config.medBrightness;
		const MedHiSetpoint = config.medhiBrightness;
		const HiSetpoint = config.hiBrightness;
		const custOffTxt = config.customOffText;
		const custLowTxt = config.customLowText;
		const custLowMedTxt = config.customLowMedText;
		const custMedTxt = config.customMedText;
		const custMedHiTxt = config.custonMedHiText;
		const custHiTxt = config.customHiText;
						
		
		let lowSetpoint;
		let lowmedSetpoint;
		let medSetpoint;
		let medhiSetpoint;
		let hiSetpoint;
		let low;
		let lowmed;
		let med;
		let medhi;
		let high;
		let offstate;
		
		if (custSetpoint) {
			medSetpoint = parseInt(MedSetpoint);
			if (parseInt(LowSetpoint) < 1) {
				lowSetpoint = 1;
			} else {
				lowSetpoint =  parseInt(LowSetpoint);
			}
			if (parseInt(HiSetpoint) > 254) {	
				hiSetpoint = 254;
			} else {
				hiSetpoint = parseInt(HiSetpoint);
			}
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.brightness >= 0 && stateObj.attributes.brightness <= ((medSetpoint + lowSetpoint)/2 ) ) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness > ((medSetpoint + lowSetpoint)/2 ) && stateObj.attributes.brightness <= ((hiSetpoint + medSetpoint)/2) ) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness > ((hiSetpoint + medSetpoint)/2) && stateObj.attributes.brightness <= 255) {
					high = 'on';
				} else {
					offstate = 'on';
				}	
			}
		} else {
			lowSetpoint =  parseInt(LowSetpoint);
			medSetpoint = parseInt(MedSetpoint);
			hiSetpoint = parseInt(HiSetpoint);
			if (stateObj && stateObj.attributes) {
				if (stateObj.state == 'on' && stateObj.attributes.brightness >= 0 && stateObj.attributes.brightness <= 85) {
					low = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness >= 86 && stateObj.attributes.brightness <= 170) {
					med = 'on';
				} else if (stateObj.state == 'on' && stateObj.attributes.brightness >= 171 && stateObj.attributes.brightness <= 255) {
					high = 'on';
				} else {
					offstate = 'on';
				}
			}
		}
		
		let lowcolor;
		let medcolor;
		let hicolor;
		let offcolor;

				
		if (custTheme) {
			if (low == 'on') {
				lowcolor = 'background-color:' + OnLowClr;
			} else {
				lowcolor = 'background-color:' + buttonOffClr;
			}
			if (med == 'on') {
				medcolor = 'background-color:'  + OnMedClr;
			} else {
				medcolor = 'background-color:' + buttonOffClr;
			}
			if (high == 'on') {
				hicolor = 'background-color:'  + OnHiClr;
			} else {
				hicolor = 'background-color:' + buttonOffClr;
			}
			if (offstate == 'on') {
				offcolor = 'background-color:'  + OffClr;
			} else {
				offcolor = 'background-color:' + buttonOffClr;
			}
		} else {
			if (low == 'on') {
				lowcolor = 'background-color: var(--switch-checked-color)';
			} else {
				lowcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (med == 'on') {
				medcolor = 'background-color: var(--switch-checked-color)';
			} else {
				medcolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (high == 'on') {
				hicolor = 'background-color: var(--switch-checked-color)';
			} else {
				hicolor = 'background-color: var(--switch-unchecked-color)';
			}
			if (offstate == 'on') {
				offcolor = 'background-color: var(--switch-checked-color)';
			} else {
				offcolor = 'background-color: var(--switch-unchecked-color)';
			}
		}

		let offtext = custOffTxt;
		let lowtext = custLowTxt;
		let medtext = custMedTxt;
		let hitext = custHiTxt;
		
		let offname = 'off'
		let lowname = 'low'
		let medname = 'medium'
		let hiname = 'high'
		
		let buttonwidth = buttonWidth;
		let buttonheight = buttonHeight;
		
		if (revButtons) {
			this._stateObj = stateObj;
			this._leftState = (offstate == 'on');
			this._midLeftState = (low === 'on');
			this._midRightState = (med === 'on');
			this._rightState = (high === 'on');
			this._width = buttonwidth;
			this._height = buttonheight;
			this._leftColor = offcolor;
			this._midLeftColor = lowcolor;
			this._midRightColor = medcolor;
			this._rightColor = hicolor;
			this._lowSP = lowSetpoint;
			this._medSP = medSetpoint;
			this._highSP = hiSetpoint;
			this._leftText = offtext;
			this._midLeftText = lowtext;
			this._midRightText = medtext;
			this._rightText = hitext;
			this._leftName = offname;
			this._midLeftName = lowname;
			this._midRightName = medname;
			this._rightName = hiname;
		} else {
			this._stateObj = stateObj;
			this._leftState = (high == 'on');
			this._midLeftState = (med === 'on');
			this._midRightState = (low === 'on');
			this._rightState = (offstate === 'on');
			this._width = buttonwidth;
			this._height = buttonheight;
			this._leftColor = hicolor;
			this._midLeftColor = medcolor;
			this._midRightColor = lowcolor;
			this._rightColor = offcolor;
			this._lowSP = lowSetpoint;
			this._medSP = medSetpoint;
			this._highSP = hiSetpoint;
			this._leftText = hitext;
			this._midLeftText = medtext;
			this._midRightText = lowtext;
			this._rightText = offtext;
			this._leftName = hiname;
			this._midLeftName = medname;
			this._midRightName = lowname;
			this._rightName = offname;
		}
	}

	setBrightness(e) {
		const level = e.currentTarget.getAttribute('name');
		const param = {entity_id: this._config.entity};
		if( level == 'off' ){
			this.hass.callService('light', 'turn_off', param);
		} else if (level == 'low') {
			param.brightness = this._lowSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'medium') {
			param.brightness = this._medSP;
			this.hass.callService('light', 'turn_on', param);
		} else if (level == 'high') {
			param.brightness = this._highSP;
			this.hass.callService('light', 'turn_on', param);
		}
	}
}
	
customElements.define('light-brightness-preset-row', CustomLightBrightnessRow);
