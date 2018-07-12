require("./DatePicker.styl")

const React = require("react")
const L = require("lodash")
const Moment = require("moment")
const MomentRange = require("moment-range")
const moment = MomentRange.extendMoment(Moment)
const PubSub = require("../../../pubsub")
const momentLocale = moment.localeData()
const PropTypes = require("prop-types")

const Loc = require("./locale")

const logo = require("./logo.png")

class DatePicker extends React.Component {

	constructor(props) {
		super(props)

		const { value, showHours, saveOnDateClick, closeOnBgClick, closeOnEmptyClick, format, startOnMonday, locale } = props

		const date = value ? new Date(value) : new Date()
		const year 	 = date.getFullYear()
		const month  = date.getMonth()
		const day 	 = date.getDate()
		const hour 	 = date.getHours()
		const minute = date.getMinutes()

		const loc = ( locale && Loc[locale] ) ? locale : "en"

		this.state = {
			selectedDate: date,
			showHours: !!showHours,
			saveOnDateClick: !!saveOnDateClick,
			closeOnBgClick: !!closeOnBgClick || !!closeOnEmptyClick,
			//
			year,
			month,
			day,
			hour,
			minute,
			//
			startOnMonday: startOnMonday || false,
			format: (format == "12") ? "12" : "24",
			locale: loc
		}
	}

	componentDidMount() {
		if (this.state.closeOnBgClick)
			window.document.addEventListener("click", this.onBgClick)
	}

	componentWillUnmount() {
		if (this.state.closeOnBgClick)
			window.document.removeEventListener("click", this.onBgClick)
	}

	onBgClick = (e) => {

		let target = e.target || e.srcElement
		let isPicker = false

		if (!target)
			return

		while (target && target.parentElement) {
			if (target.className.indexOf("poppinz-date-picker-wrapper") > -1) {
				isPicker = true
				break
			}
			target = target.parentElement
		}

		if (!isPicker)
			this.onClose()
	}

	onClose = () => {
		this.props.onClose()
	}

	onAccept = () => {

		const { selectedDate, hour, minute } = this.state

		selectedDate.setHours(hour)
		selectedDate.setMinutes(minute)

		this.props.onChange(new Date(selectedDate))
		this.props.onClose()
	}

	decYear = () => {

		const { year } = this.state

		let v = year - 1

		if (v < 0)
			v = 9999

		this.setState({ year:v })
	}

	incYear = () => {

		const { year } = this.state

		let v = year + 1

		if (v == 10000)
			v = 0

		this.setState({ year:v })
	}

	onHourChange = (e) => {

		let v = +e.target.value

		const { format, hour } = this.state

		if ( isNaN(v) )
			return

		if (format == "12") {
			if (v < 0)
				v = 0
			else if (v == 12)
				v = 0
			else if (v > 12)
				v = 11
			if (hour > 11) {
				v = v + 12
			}
		} else {
			if (v < 0)
				v = 0
			else if (v > 23)
				v = 23
		}

		this.setState({ hour:v })
	}

	onMinuteChange = (e) => {

		let v = +e.target.value

		if ( isNaN(v) )
			return
		else if (v < 0)
			v = 59
		else if (v > 59)
			v = 0

		this.setState({ minute: v })
	}

	decMonth = () => {

		const { month } = this.state

		if (month == 0) {
			this.setState({
				month: 11,
				year: this.state.year - 1
			})
		} else {
			this.setState({
				month: this.state.month - 1
			})
		}
	}

	incMonth = () => {
		const { month } = this.state

		if (month == 11) {
			this.setState({
				month: 0,
				year: this.state.year + 1
			})
		} else {
			this.setState({
				month: this.state.month + 1
			})
		}
	}

	incHour = () => {

		const { hour, format } = this.state

		let v = +hour + 1

		if (format == "12") {
			if (v == 12)
				v = 0
			if (v > 23)
				v = 12
		} else {
			if (v > 23)
				v = 0
		}

		this.setState({ hour:v })
	}

	decHour = () => {

		const { hour, format } = this.state

		let v = +hour - 1

		if (format == "12") {
			if (v == 11)
				v = 23
			if (v < 0)
				v = 11
		} else {
			if (v < 0)
				v = 23
		}

		this.setState({ hour:v })
	}

	onHourKeyDown = (e) => {

		const key = e.key ? e.key.toLowerCase() : null

		if (key == "arrowup") {
			this.incHour()
		}

		if (key == "arrowdown") {
			this.decHour()
		}
	}

	changePMAM = () => {

		const { hour } = this.state

		if (hour > 11) {
			return this.onPMAMChange("AM")
		}

		if (hour < 12) {
			return this.onPMAMChange("PM")
		}
	}

	incPMAM = () => {
		return this.changePMAM()
	}

	decPMAM = () => {
		return this.changePMAM()
	}

	onFormatChange = () => {
	}

	onPMAMChange = (e) => {
		const v = (e == "AM") ? "am" : "pm"
		const { hour } = this.state

		if (v == "am" && hour > 11) {
			return this.setState({ hour:hour-12 })
		}

		if (v == "pm" && hour < 12) {
			return this.setState({ hour:hour+12 })
		}
	}

	onPMAMKeyDown = (e) => {
		if (e && e.key) {

			const v = e.key.toLowerCase()

			if (v == "arrowup") {
				return this.incPMAM()
			}

			if (v == "arrowdown") {
				return this.decPMAM()
			}
		}
	}

	incMinute = () => {

		const { minute } = this.state

		let v = +minute + 1

		if (v > 59)
			v = 0

		this.setState({ minute:v })
	}

	decMinute = () => {

		const { minute } = this.state

		let v = +minute - 1

		if (v < 0)
			v = 59

		this.setState({ minute:v })
	}

	onMinuteKeyDown = (e) => {

		const key = e.key ? e.key.toLowerCase() : null

		if (key == "arrowup") {
			this.incMinute()
		}

		if (key == "arrowdown") {
			this.decMinute()
		}
	}

	onDateClick = (value) => {
		if (!value || +value == 0) return

		const { year, month, hour, minute, saveOnDateClick } = this.state

		const d = new Date(year, month, value, hour, minute)

		d.setFullYear(year)

		this.setState({
			day: value,
			selectedDate: d
		}, () => {
			if (saveOnDateClick)
				return this.onAccept()
		})
	}

	onYearChange = (e) => {

		let v = +e.target.value

		if ( isNaN(v) )
			return

		if (v < 0)
			v = 9999

		v = +("0000"+v).slice(-4)

		this.setState({ year:v })
	}

	onYearKeyDown = (e) => {

		const key = e.key ? e.key.toLowerCase() : null

		if (key == "arrowup") {
			this.incYear()
		}

		if (key == "arrowdown") {
			this.decYear()
		}
	}

	setNow = () => {

		const date = new Date()

		this.setState({
			selectedDate: date,
			month: date.getMonth(),
			year: date.getFullYear(),
			day: date.getDate(),
			hour: date.getHours(),
			minute: date.getMinutes()
		})
	}

	renderHeader = () => {

		const { year, month, locale } = this.state
		const icon = "query_builder" //"timer"
		const mLoc = Loc[locale].month

		const now = Loc[locale]["now"]

		const _year = ("0000"+year).slice(-4)
		const M = mLoc[moment([ year, month ]).format("MMM").toLowerCase()]

		return (
			<div className="date-picker-header">
				<div className="now-wrapper">
					<div className="now-container">
						<div className="now-label">{ now }</div>
						<div className="now-icon-wrapper">
							<div className="icon material-icons" onClick={ this.setNow }>{ icon }</div>
						</div>
					</div>
				</div>
				<div className="date-selector-wrapper">
					<div className="year-selector-wrapper">
						<div className="date-selector-icon-wrapper">
							<div className="icon material-icons" onClick={ this.decYear }>keyboard_arrow_left</div>
						</div>
						<div className="date-selector-info-wrapper">
							<input type="text" value={ _year } onChange={ this.onYearChange } onKeyDown={ this.onYearKeyDown } />
						</div>
						<div className="date-selector-icon-wrapper">
							<div className="icon material-icons" onClick={ this.incYear }>keyboard_arrow_right</div>
						</div>
					</div>
					<div className="month-selector-wrapper">
						<div className="date-selector-icon-wrapper">
							<div className="icon material-icons" onClick={ this.decMonth }>keyboard_arrow_left</div>
						</div>
						<div className="date-selector-info-wrapper">
							<div className="date-selector-label">{ M }</div>
						</div>
						<div className="date-selector-icon-wrapper">
							<div className="icon material-icons" onClick={ this.incMonth }>keyboard_arrow_right</div>
						</div>
					</div>
				</div>
				<div className="date-picker-logo-wrapper">
					<div className="date-picker-logo">
						<img src={ logo } alt="poppinz" />
					</div>
				</div>
			</div>
		)
	}

	renderContent = () => {

		const { year, month, startOnMonday, selectedDate } = this.state

		const w = startOnMonday ? "isoWeek" : "week"

		const firstDay 	= moment([year,month]).startOf(w)
		const endDay 	= moment([year,month]).endOf("month")
		const weekList 	= Array.from(moment.range(firstDay, endDay).by("weeks"))
		const calendar 	= []

		weekList.map(s => {
			const e = moment(s).add(6, "day")
			calendar.push(moment.range(s, e))
		})

		const weeks = calendar.map((week, indx) => {
			const dayList = Array.from(week.by("days"))

			const days = dayList.map((day, dayIndex) => {
				const isToday = day.format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")
				const isCurrentMonth = day.month() == month
				const isSelectedDate = day.format("DD-MM-YYYY") == moment(selectedDate).format("DD-MM-YYYY")
				const d = day.day()

				let dayClasses = "day"
				if (d == 0 || d == 6) {
					dayClasses += " day-weekend"
				}
				if (isSelectedDate) {
					dayClasses += " day-selected"
				}
				if (isToday) {
					dayClasses += " day-current"
				}
				if (!isCurrentMonth) {
					dayClasses += " day-muted"
				}

				const monthDate = isCurrentMonth ? day.format("DD") + "" : "0"

				return (
					<div key={ dayIndex } className={ dayClasses }>
						<div className="day-value" onClick={ () => this.onDateClick(monthDate) }>{ monthDate }</div>
					</div>
				)
			})

			return (
				<div className="week" key={ indx }>
					{ days }
				</div>
			)
		})

		return (
			<div className="date-picker-body-content">
				{ weeks }
			</div>
		)
	}

	renderBody = () => {

		const { startOnMonday, locale } = this.state
		const { week } = Loc[locale]

		const header = [
			<div key="a">{ week["mon"] }</div>,
			<div key="b">{ week["tue"] }</div>,
			<div key="c">{ week["wen"] }</div>,
			<div key="d">{ week["thu"] }</div>,
			<div key="e">{ week["fri"] }</div>,
			<div key="f">{ week["sat"] }</div>
			]

		const sun = <div key="h">{ week["sun"] }</div>

		if (startOnMonday)
			header.push(sun)
		else
			header.unshift(sun)

		return (
			<div className="date-picker-body">
				<div className="date-picker-body-week-title-wrapper">
					<div className="date-picker-body-week-title">
						{ header }
					</div>
				</div>
				<div className="date-picker-body-content-wrapper">
					{ this.renderContent() }
					<div className="date-picker-body-separator"></div>
				</div>
			</div>
		)
	}

	renderFooter = () => {

		const { showHours, hour, minute, format, locale } = this.state
		const { time } = Loc[locale]

		let _h = ( format == "12" ) ? ( ( hour > 11 ) ? hour - 12 : hour ) : hour

		if (_h === 0 && format == "12") {
			_h = 12
		}

		const _hour = _h < 10 ? "0"+_h : ""+_h
		const _minute = minute < 10 ? "0"+minute : ""+minute

		const F = ( hour < 12 ) ? "AM" : "PM"

		const PMAM = format == "12"
				? ( <div className="footer-ampm">
						<input type="text" value={ F } onChange={ this.onFormatChange } onKeyDown={ this.onPMAMKeyDown } />
						<div className="time-arrows-wrapper">
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.incPMAM }>arrow_drop_up</div>
							</div>
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.decPMAM }>arrow_drop_down</div>
							</div>
						</div>
					</div> )
				: null

		const H = showHours
				? (	<div className="footer-hours">
						<div className="hours-label">{ time["h"] }:</div>
						<input type="text" value={ _hour } onChange={ this.onHourChange } onKeyDown={ this.onHourKeyDown } />
						<div className="time-arrows-wrapper">
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.incHour }>arrow_drop_up</div>
							</div>
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.decHour }>arrow_drop_down</div>
							</div>
						</div>
					</div> )
				: null

		const m = showHours
				? ( <div className="footer-minutes">
						<div className="minutes-label">{ time["m"] }:</div>
						<input type="text" value={ _minute } onChange={ this.onMinuteChange } onKeyDown={ this.onMinuteKeyDown } />
						<div className="time-arrows-wrapper">
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.incMinute }>arrow_drop_up</div>
							</div>
							<div className="arrow-icon-wrapper">
								<div className="icon material-icons" onClick={ this.decMinute }>arrow_drop_down</div>
							</div>
						</div>
					</div> )
				: null

		const T = showHours
				? ( <div className="footer-time">
						<div className="footer-hours-wrapper">
							{ H }
						</div>
						<div className="footer-ampm-wrapper">
							{ PMAM }
						</div>
						<div className="footer-minutes-wrapper">
							{ m }
						</div>
					</div> )
				: null

		return (
			<div className="date-picker-footer">
				<div className="footer-time-wrapper">
					{ T }
				</div>
				<div className="footer-buttons-wrapper">
					<div className="footer-buttons">
						<div className="footer-icon-wrapper">
							<div className="icon material-icons check" onClick={ this.onAccept }>check</div>
						</div>
						<div className="footer-icon-wrapper">
							<div className="icon material-icons close" onClick={ this.onClose }>close</div>
						</div>
					</div>
				</div>
			</div>
		)
	}

	render() {

		return (
			<div className="poppinz-date-picker-wrapper">
				<div className="poppinz-date-picker">
					<div className="date-picker-header-wrapper">
						{ this.renderHeader() }
					</div>
					<div className="date-picker-body-wrapper">
						{ this.renderBody() }
					</div>
					<div className="date-picker-footer-wrapper">
						{ this.renderFooter() }
					</div>
				</div>
			</div>
		)
	}
}

module.exports = DatePicker

DatePicker.propTypes = {
	onClose: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired,
	value: PropTypes.any,
	showHours: PropTypes.bool,
	closeOnBgClick: PropTypes.bool,
	saveOnDateClick: PropTypes.bool,
	format: PropTypes.string,
	startOnMonday: PropTypes.bool,
	locale: PropTypes.string
}
