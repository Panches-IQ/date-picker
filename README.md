# date-picker
## Usage

const DatePicker = require('../date-picker/DatePicker')

<DatePicker 
				value={ value }
				showHours={ false }
				onClose={ this.toggleDatePicker }
				onChange={ this.onDueChange }
				saveOnDateClick
				closeOnBgClick
				format={ "12/24 only for time inputs" }
				startOnMonday={ false }
				locale="en"
/>
