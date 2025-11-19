export const teamInviteTemplate = (inviterName, teamName) => {
  return `
  <div style="padding:20px; font-family:Arial;">
    <h2 style="color:#4F46E5;">Task Manager Pro</h2>

    <p>Hi there,</p>

    <p>
      <strong>${inviterName}</strong> has invited you to join the team:
      <strong>${teamName}</strong>.
    </p>

    <p>
      You can now log in to your account to view the team and start collaborating.
    </p>

    <br />

    <p style="color:#555; font-size:13px;">
      – Task Manager Pro Team
    </p>
  </div>
  `;
};
