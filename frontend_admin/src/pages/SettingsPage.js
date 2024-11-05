// src/pages/SettingsPage.js
import AuditTrail from '../components/Settings/AuditTrail';
import NotificationsSettings from '../components/Settings/NotificationsSettings';
import OTPValidation from '../components/Settings/OTPValidation';

const SettingsPage = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Audit Trail</h2>
        <AuditTrail />
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Notification Settings</h2>
        <NotificationsSettings />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">OTP Validation Settings</h2>
        <OTPValidation />
      </section>
    </div>
  );
};

export default SettingsPage;
