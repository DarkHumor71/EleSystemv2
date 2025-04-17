import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({
  auth: { isAuthenticated, loading, isResident, isModerator, is_admin },
  children,
}) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Define role-based whitelists
  const roleWhitelists = {
    resident: ['/apr', '/profile'],
    admin: ['/dash', '/create_building'],
    moderator: [
      '/mod',
      '/apartments',
      '/create_apartment',
      '/qrcode',
      '/expenses',
      '/profile',
    ],
  };
  if (loading) return null;
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  // Check role and whitelist
  if (isAuthenticated) {
    if (is_admin && !roleWhitelists.admin.includes(currentPath)) {
      return <Navigate to="/dash" />;
    }

    if (
      isResident &&
      !isModerator &&
      !roleWhitelists.resident.includes(currentPath)
    ) {
      return <Navigate to="/apr" />;
    }

    if (isModerator && !roleWhitelists.moderator.includes(currentPath)) {
      return <Navigate to="/mod" />;
    }
  }

  return children;
};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
