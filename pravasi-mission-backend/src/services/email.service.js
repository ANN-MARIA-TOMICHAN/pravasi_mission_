const { transporter, from } = require("../config/email.config");

function normalizeName(value) {
  const name = String(value || "").trim();
  return name || "User";
}

function buildRegistrationEmail({ name, otp, otpExpiryMinutes }) {
  const safeName = normalizeName(name);
  const otpLine = otp
    ? `<p><strong>Your OTP is ${otp}</strong>. It is valid for ${otpExpiryMinutes} minutes.</p>`
    : "";

  const html = `
    <p>Dear <strong>${safeName}</strong>,</p>
    ${otpLine}
    <p>We noticed that your registration on the Kerala Pravasi Mission portal is currently incomplete.</p>
    <p>To access the portal and benefit from upcoming services — which will be available only to fully registered and approved users — we kindly request you to complete your registration at the earliest by submitting the remaining details.</p>
    <p>We’re also happy to inform you that the Kerala Pravasi Mission Mobile App has now been officially launched! You can now access all services and updates conveniently from your mobile device.</p>
    <p>Android Play Store: <a href="https://play.google.com/store/apps/details?id=com.cdipd.norka">Click here</a></p>
    <p>Apple App Store: <a href="https://apps.apple.com/in/app/lokakeralamonline/id6740562302">Click here</a></p>
    <p>If you need any assistance, feel free to contact our support team.</p>
    <p>Call/WhatsApp 9446303339 | 9446423339</p>
    <p>Thanks!</p>
  `;

  const textLines = [
    `Dear ${safeName},`,
    otp ? `Your OTP is ${otp}. It is valid for ${otpExpiryMinutes} minutes.` : null,
    "",
    "We noticed that your registration on the Kerala Pravasi Mission portal is currently incomplete.",
    "To access the portal and benefit from upcoming services — which will be available only to fully registered and approved users — we kindly request you to complete your registration at the earliest by submitting the remaining details.",
    "We’re also happy to inform you that the Kerala Pravasi Mission Mobile App has now been officially launched! You can now access all services and updates conveniently from your mobile device.",
    "Android Play Store: https://play.google.com/store/apps/details?id=com.cdipd.norka",
    "Apple App Store: https://apps.apple.com/in/app/lokakeralamonline/id6740562302",
    "",
    "If you need any assistance, feel free to contact our support team.",
    "Call/WhatsApp 9446303339 | 9446423339",
    "Thanks!",
  ].filter(Boolean);

  return { html, text: textLines.join("\n") };
}

async function sendRegistrationNudgeEmail({ to, name, otp, otpExpiryMinutes }) {
  if (!to) throw new Error("Recipient email is required");

  const { html, text } = buildRegistrationEmail({
    name,
    otp,
    otpExpiryMinutes,
  });

  return transporter.sendMail({
    from,
    to,
    subject: "Complete Your Registration on Kerala Pravasi Mission & Explore Our New Mobile App",
    text,
    html,
  });
}

module.exports = { sendRegistrationNudgeEmail };
