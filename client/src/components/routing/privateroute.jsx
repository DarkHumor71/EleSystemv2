import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';

/**
 * PrivateRoute component is used to handle route access control based on the user's authentication and role.
 * It checks if the user is authenticated and authorized to access a certain route based on their role.
 * Redirects the user to appropriate routes based on their role and current path.
 * 
 * @param {Object} props - Component props
 * @param {Object} auth - The authentication state from Redux store
 * @param {boolean} auth.isAuthenticated - Whether the user is authenticated
 * @param {boolean} auth.loading - Whether the authentication data is still loading
 * @param {boolean} auth.isResident - Whether the user is a resident
 * @param {boolean} auth.isModerator - Whether the user is a moderator
 * @param {boolean} auth.is_admin - Whether the user is an admin
 * @param {ReactNode} children - The child components to be rendered if the user has permission to access the route
 * 
 * @returns {ReactNode} - Either the child components or a redirect to the appropriate route
 */
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

  // Loading state handling (avoid rendering until loading is done)
  if (loading) return null;

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated && !loading) {
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, check their role and determine if they can access the current route
  if (isAuthenticated) {
    // Admin role validation
    if (is_admin && !roleWhitelists.admin.includes(currentPath)) {
      return <Navigate to="/dash" />;
    }

    // Resident role validation
    if (isResident && !isModerator && !roleWhitelists.resident.includes(currentPath)) {
      return <Navigate to="/apr" />;
    }

    // Moderator role validation
    if (isModerator && !roleWhitelists.moderator.includes(currentPath)) {
      return <Navigate to="/mod" />;
    }
  }

  // If all checks pass, render the child components
  return children;
};

// Prop validation
PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired,
};

// Mapping Redux state to component props
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(PrivateRoute);
