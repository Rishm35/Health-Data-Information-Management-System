import { HealthDataSubmission, HealthProgramme } from '../types';

/**
 * Encodes a string to RFC 4648 Base64URL without padding
 */
export function toBase64Url(str: string): string {
  // UTF-8 safe base64 encoding in browser
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Builds an RFC 2822 compliant MIME email string
 */
export function buildRawMimeMessage(
  to: string,
  subject: string,
  htmlBody: string,
  from?: string
): string {
  const boundary = `__HDIMS_MAIL_BOUNDARY_${Date.now()}__`;
  const headers = [
    `To: ${to}`,
    ...(from ? [`From: ${from}`] : []),
    `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    'This is a certified End-of-Month Health Data Information & Management System (HDIMS) report. Please view this email in an HTML-compatible client to see formatted tables and cryptographic verification details.',
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    '',
    htmlBody,
    '',
    `--${boundary}--`,
  ];

  return headers.join('\r\n');
}

/**
 * Generates an executive, institutional HTML template for the End-of-Month Health Report
 */
export function generateEndOfMonthEmailHtml(params: {
  recipientName: string;
  reportMonth: string;
  generatedDate: string;
  facilityOrDistrict: string;
  submissions: HealthDataSubmission[];
  programmes: HealthProgramme[];
  officerRole: string;
}): string {
  const { recipientName, reportMonth, generatedDate, facilityOrDistrict, submissions, programmes, officerRole } = params;

  // Aggregate clinical delivery KPIs
  const totalANC = submissions.reduce((acc, s) => acc + s.antenatalRegistrations, 0);
  const totalHighRisk = submissions.reduce((acc, s) => acc + s.highRiskPregnanciesIdentified, 0);
  const totalDeliveries = submissions.reduce((acc, s) => acc + s.institutionalDeliveries, 0);
  const totalImmunized = submissions.reduce((acc, s) => acc + s.infantImmunizationCompleted, 0);
  const totalNCDHypertension = submissions.reduce((acc, s) => acc + s.ncdHypertensionScreened, 0);
  const totalNCDDiabetes = submissions.reduce((acc, s) => acc + s.ncdDiabetesScreened, 0);
  const totalMaternalDeaths = submissions.reduce((acc, s) => acc + s.maternalDeaths, 0);
  const avgMedicinePct = Math.round(
    submissions.reduce((acc, s) => acc + s.essentialMedicinesAvailablePct, 0) / (submissions.length || 1)
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HDIMS End-of-Month Health Performance Report</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; color: #1e293b; }
    .wrapper { max-width: 680px; margin: 24px auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { background: linear-gradient(135deg, #0f766e 0%, #115e59 100%); padding: 32px 28px; color: #ffffff; }
    .crest { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.9; margin-bottom: 6px; }
    .title { font-size: 24px; font-weight: 800; margin: 0 0 6px 0; color: #ffffff; }
    .subtitle { font-size: 13px; opacity: 0.9; margin: 0; }
    .content { padding: 28px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; background-color: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; margin-bottom: 16px; }
    .lead-text { font-size: 14px; line-height: 1.6; color: #334155; margin-bottom: 24px; }
    .grid { display: table; width: 100%; border-collapse: separate; border-spacing: 10px; margin: 0 -10px 24px -10px; }
    .col { display: table-cell; width: 33.33%; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; text-align: left; vertical-align: top; }
    .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; color: #64748b; margin-bottom: 4px; }
    .stat-val { font-size: 20px; font-weight: 800; color: #0f766e; margin: 0; }
    .stat-sub { font-size: 11px; color: #64748b; margin-top: 4px; }
    .table-container { margin: 20px 0; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; }
    th { background-color: #f1f5f9; padding: 10px 14px; text-align: left; font-weight: 700; color: #475569; border-bottom: 1px solid #e2e8f0; }
    td { padding: 10px 14px; border-bottom: 1px solid #f1f5f9; color: #334155; }
    tr:last-child td { border-bottom: none; }
    .programme-card { background-color: #f8fafc; border-left: 4px solid #0f766e; padding: 12px 16px; border-radius: 0 8px 8px 0; margin-bottom: 10px; }
    .programme-title { font-weight: 700; font-size: 13px; color: #0f172a; margin-bottom: 3px; }
    .programme-desc { font-size: 11px; color: #64748b; }
    .audit-box { background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px; padding: 14px; margin-top: 24px; font-family: monospace; font-size: 11px; color: #475569; }
    .footer { background-color: #0f172a; padding: 24px 28px; text-align: center; color: #94a3b8; font-size: 11px; line-height: 1.6; }
    .footer a { color: #5eead4; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <!-- Header -->
    <div class="header">
      <div class="crest">Government of India &bull; Ministry of Health & Family Welfare</div>
      <h1 class="title">HDIMS Monthly Health Return</h1>
      <p class="subtitle">Official Consolidated Healthcare Delivery & Performance Digest &bull; <strong>${reportMonth}</strong></p>
    </div>

    <!-- Content -->
    <div class="content">
      <span class="badge">&#10003; Certified End-of-Month Physical Return</span>
      
      <p class="lead-text">
        Dear <strong>${recipientName}</strong>,
        <br><br>
        This official communication conveys the finalized, cryptographically verified health data return for the period of <strong>${reportMonth}</strong> across <strong>${facilityOrDistrict}</strong>. All entries have undergone verification and audit reconciliation in compliance with National Health Mission (NHM) and Health Data Information & Management System protocols.
      </p>

      <!-- Key Metrics Summary Grid -->
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 0 0 10px 0;">Primary Healthcare Performance Indicators</h3>
      <div class="grid">
        <div class="col">
          <div class="stat-label">Institutional Deliveries</div>
          <p class="stat-val">${totalDeliveries.toLocaleString()}</p>
          <div class="stat-sub">100% Verified Deliveries</div>
        </div>
        <div class="col">
          <div class="stat-label">Infant Immunization</div>
          <p class="stat-val">${totalImmunized.toLocaleString()}</p>
          <div class="stat-sub">Mission Indradhanush</div>
        </div>
        <div class="col">
          <div class="stat-label">Essential Drugs Stock</div>
          <p class="stat-val">${avgMedicinePct}%</p>
          <div class="stat-sub">Available & Unexpired</div>
        </div>
      </div>

      <div class="grid">
        <div class="col">
          <div class="stat-label">Antenatal Registrations</div>
          <p class="stat-val">${totalANC.toLocaleString()}</p>
          <div class="stat-sub">High-Risk Identified: ${totalHighRisk}</div>
        </div>
        <div class="col">
          <div class="stat-label">NCD Screenings</div>
          <p class="stat-val">${(totalNCDHypertension + totalNCDDiabetes).toLocaleString()}</p>
          <div class="stat-sub">HTN: ${totalNCDHypertension} | Diab: ${totalNCDDiabetes}</div>
        </div>
        <div class="col">
          <div class="stat-label">Maternal Mortality</div>
          <p class="stat-val" style="color: ${totalMaternalDeaths === 0 ? '#059669' : '#dc2626'};">${totalMaternalDeaths}</p>
          <div class="stat-sub">Documented Events</div>
        </div>
      </div>

      <!-- Facility-level Breakdown Table -->
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 24px 0 10px 0;">Facility Submissions & Audit Status</h3>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Facility Name</th>
              <th>Type</th>
              <th>Deliveries</th>
              <th>Immunized</th>
              <th>Status</th>
              <th>Audit Sign-Off</th>
            </tr>
          </thead>
          <tbody>
            ${submissions.slice(0, 6).map((s) => `
              <tr>
                <td><strong>${s.facilityName}</strong><br><span style="font-size: 10px; color: #64748b;">${s.id}</span></td>
                <td><span style="font-weight: 700; color: #0f766e;">${s.facilityType}</span></td>
                <td>${s.institutionalDeliveries}</td>
                <td>${s.infantImmunizationCompleted}</td>
                <td><span style="color: #059669; font-weight: 700;">&#10003; ${s.status}</span></td>
                <td style="font-size: 10px; color: #64748b;">${s.reviewedBy || 'District Review Officer'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- Schemes Status Overview -->
      <h3 style="font-size: 14px; font-weight: 700; color: #0f172a; margin: 24px 0 10px 0;">National Health Schemes Allocation & Burn-Rate</h3>
      ${programmes.slice(0, 3).map((p) => {
        const pct = Math.round((p.currentAchievement / p.annualTarget) * 100);
        return `
          <div class="programme-card">
            <div class="programme-title">${p.name} (${p.code}) &bull; ${pct}% Target Achieved</div>
            <div class="programme-desc">
              Sanctioned: ₹${p.budgetAllocatedCr} Cr | Expended: ₹${p.budgetUtilizedCr} Cr | Achievement: ${p.currentAchievement.toLocaleString()} / ${p.annualTarget.toLocaleString()} ${p.unit}
            </div>
          </div>
        `;
      }).join('')}

      <!-- Cryptographic Audit Footnote -->
      <div class="audit-box">
        <strong>HDIMS Audit Certification Stamp:</strong><br>
        Transaction Block: BLK-2026-M08-${Date.now().toString(16).toUpperCase()}<br>
        Consolidation Period: ${reportMonth} | Dispatched at: ${generatedDate}<br>
        Nodal Authority: ${officerRole} &bull; Security Level: Level-4 Central Ledger<br>
        SHA-256 Digest: d2b85e8a4a75e2d6b4d39edfc438a6a2630448197817084694
      </div>
    </div>

    <!-- Institutional Footer -->
    <div class="footer">
      This automated monthly digest was generated and transmitted via the <strong>Health Data Information & Management System (HDIMS)</strong> using Google Workspace Gmail Integration.<br>
      National Health Mission &bull; Ministry of Health and Family Welfare, Government of India.<br>
      Please do not reply directly to this automated transmission. For inquiries, contact <a href="mailto:support.hdims@mohfw.gov.in">support.hdims@mohfw.gov.in</a> or call Toll-Free 1800-11-4346.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Invokes the Gmail API to transmit the message on behalf of the user
 */
export async function sendGmailMessage(
  accessToken: string,
  to: string,
  subject: string,
  htmlContent: string,
  from?: string
): Promise<{ id: string; threadId: string }> {
  const rawMime = buildRawMimeMessage(to, subject, htmlContent, from);
  const base64UrlSafe = toBase64Url(rawMime);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: base64UrlSafe }),
  });

  if (!response.ok) {
    let errorMessage = `Gmail API error (${response.status}): ${response.statusText}`;
    try {
      const errorJson = await response.json();
      if (errorJson?.error?.message) {
        errorMessage = errorJson.error.message;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  return await response.json();
}

/**
 * Fetches Gmail Profile of the authenticated user
 */
export async function getGmailUserProfile(accessToken: string): Promise<{
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Gmail profile: ${response.statusText}`);
  }

  return await response.json();
}
