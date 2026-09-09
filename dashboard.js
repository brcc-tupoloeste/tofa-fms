/**
 * ============================================================
 * TOFA DASHBOARD MODULE
 * ============================================================
 * Separate from app.js so the working Collections module is
 * not changed.
 * ============================================================
 */

document.addEventListener('DOMContentLoaded', function() {
  loadDashboardSummary();
});

async function loadDashboardSummary() {
  try {
    const year = new Date().getFullYear();
    const result = await apiGetDashboardSummary(year);

    setDashboardText(
      'dashboardActiveMembers',
      Number(result.activeMembers || 0).toLocaleString('en-PH')
    );

    setDashboardMoney('dashboardRegistrationFee', result.registrationFeeOutstanding);
    setDashboardMoney('dashboardYearlyDue', result.yearlyDueOutstanding);
    setDashboardMoney('dashboardCollections', result.totalCollections);
    setDashboardMoney('dashboardExpenses', result.totalExpenses);
    setDashboardMoney('dashboardAssociationBalance', result.associationBalance);
    setDashboardMoney('dashboardPreviousCollections', result.previousMonthCollections);
    setDashboardMoney('dashboardOutstanding', result.totalOutstanding);

    const title = document.getElementById('previousCollectionsTitle');
    if (title && result.previousMonthLabel) {
      title.textContent = result.previousMonthLabel + ' Collections';
    }
  } catch (error) {
    console.error('TOFA DASHBOARD ERROR:', error);
  }
}

function setDashboardText(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) element.textContent = value;
}

function setDashboardMoney(elementId, value) {
  const element = document.getElementById(elementId);
  if (!element) return;

  element.textContent =
    '₱' +
    (Number(value || 0)).toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
}
