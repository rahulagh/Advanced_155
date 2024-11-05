// src/components/ProfileDetails.js
import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/styles/ProfileDetails.css'; // Import CSS file for styling

const ProfileDetails = ({ profile }) => {
  if (!profile) {
    return <div className="no-profile">No profile selected</div>;
  }

  const { name, email, phone, company, remainingQuotas, featureUsage } = profile;

  return (
    <div className="profile-details">
      <h2>Profile Details</h2>
      <p><strong>Name:</strong> {name || 'N/A'}</p>
      <p><strong>Email:</strong> {email || 'N/A'}</p>
      <p><strong>Phone:</strong> {phone || 'N/A'}</p>
      <p><strong>Company:</strong> {company || 'N/A'}</p>

      {remainingQuotas && (
        <>
          <h3>Quotas:</h3>
          <p><strong>Job Posts Remaining:</strong> {remainingQuotas.jobPosts || 0}</p>
          <p><strong>Candidate Searches Remaining:</strong> {remainingQuotas.candidateSearches || 0}</p>
          <p><strong>Bulk Messages Remaining:</strong> {remainingQuotas.bulkMessages || 0}</p>
        </>
      )}

      {featureUsage && (
        <>
          <h3>Feature Usage:</h3>
          <p><strong>Video Interviews Conducted:</strong> {featureUsage.videoInterviews || 0}</p>
        </>
      )}
    </div>
  );
};

ProfileDetails.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    company: PropTypes.string,
    remainingQuotas: PropTypes.shape({
      jobPosts: PropTypes.number,
      candidateSearches: PropTypes.number,
      bulkMessages: PropTypes.number,
    }),
    featureUsage: PropTypes.shape({
      videoInterviews: PropTypes.number,
    }),
  }),
};

export default ProfileDetails;
