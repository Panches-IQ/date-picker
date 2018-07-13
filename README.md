# date-picker

## Usage

```javascript
const React = require("react")
const DatePicker = require("../DatePicker/DatePicker")

class MyPicker extends React.Component {

	state = {
		showPicker: true
	}

	onChange = (value) => {
		console.log(value)
	}

	onClose = () => {
		this.setState({ showPicker:false })
	}

	render() {

		const { showPicker } = this.state

		return (
			<div className="wrapper">
				{ showPicker &&
					<DatePicker
						showHours={ true }
						startOnMonday={ true }
						closeOnBgClick
						saveOnDateClick
						format="12"
						locale="ru"
						onChange={ this.onChange }
						onClose={ this.onClose }
					/>
				}
			</div>
		)
	}
}

module.exports = MyPicker
```

### Dependences

* **moment**
* **moment-range**
* **react**
* **prop-types**