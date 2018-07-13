# date-picker
## Usage
```javascript
const DatePicker = require('../date-picker/DatePicker')

<DatePicker
    value={ new Date(2016,1,1) || 1531473801828 }
    showHours={ false }
    onClose={ this.toggleDatePicker }
    onChange={ this.onDateChange }
    saveOnDateClick 
    closeOnBgClick 
    format={ "12/24 only for time inputs" } 
    startOnMonday={ false }
    locale="en" 
/>
```