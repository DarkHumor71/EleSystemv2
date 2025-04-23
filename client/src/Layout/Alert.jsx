/**
 * @file Alert.js
 * @description A reusable alert component that displays notifications from Redux state.
 */

import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

/**
 * Alert component that renders Bootstrap-style alerts.
 * @param {Array} alerts - Array of alert objects from Redux state.
 */
const Alert = ({ alerts }) =>
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map((alert) => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

Alert.propTypes = {
    alerts: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            msg: PropTypes.string.isRequired,
            alertType: PropTypes.string.isRequired,
        })
    ).isRequired,
};

const mapStateToProps = (state) => ({
    alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
