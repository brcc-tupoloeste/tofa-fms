/**
 * ============================================================
 * TOFA FINANCIAL MANAGEMENT SYSTEM
 * DASHBOARD
 * ============================================================
 */

(function () {

  function money(value) {
    const amount = Number(value || 0);
    return '₱' + amount.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  async function loadDashboard() {

    try {

      const currentYear = new Date().getFullYear();
      const result = await apiGetDashboardSummary(currentYear);

      if (!result || result.success !== true) {
        throw new Error(
          result && result.error
            ? result.error
            : 'Dashboard data could not be loaded.'
        );
      }

      setText(
        'dashboardActiveMembers',
        Number(result.activeMembers || 0).toLocaleString('en-PH')
      );

      setText('dashboardYearBadge', String(result.year || currentYear));
      setText(
        'dashboardPeriodLabel',
        'Financial overview for ' + String(result.year || currentYear)
      );

      setText('dashboardBeginningBalance', money(result.beginningBalance));
      setText('dashboardCollections', money(result.totalCollections));
      setText('dashboardExpenses', money(result.totalExpenses));
      setText('dashboardNetIncome', money(result.netIncome));
      setText('dashboardAssociationBalance', money(result.associationBalance));

      setText('dashboardPreviousBalance', money(result.previousBalance));
      setText('dashboardPreviousCollections', money(result.previousMonthCollections));
      setText('dashboardPreviousExpenses', money(result.previousMonthExpenses));
      setText('dashboardPreviousNetIncome', money(result.previousMonthNetIncome));

      setText('dashboardRegistrationFee', money(result.registrationFeeOutstanding));
      setText('dashboardYearlyDue', money(result.yearlyDueOutstanding));
      setText('dashboardRiceDebt', money(result.riceDebtOutstanding));
      setText('dashboardFertilizerDebt', money(result.fertilizerDebtOutstanding));
      setText('dashboardCashDebt', money(result.cashDebtOutstanding));
      setText('dashboardOutstanding', money(result.totalOutstanding));

      setText('dashboardFlowBeginning', money(result.beginningBalance));
      setText('dashboardFlowNet', money(result.netIncome));
      setText('dashboardFlowBalance', money(result.associationBalance));

      if (result.previousMonthLabel) {
        setText('previousMonthLabel', result.previousMonthLabel);
      }

    }

    catch (error) {

      console.error('TOFA Dashboard Error:', error);

      setText('dashboardActiveMembers', '—');
      setText('dashboardYearBadge', '—');
      setText('dashboardBeginningBalance', '₱0.00');
      setText('dashboardCollections', '₱0.00');
      setText('dashboardExpenses', '₱0.00');
      setText('dashboardNetIncome', '₱0.00');
      setText('dashboardAssociationBalance', '₱0.00');
      setText('dashboardPreviousBalance', '₱0.00');
      setText('dashboardPreviousCollections', '₱0.00');
      setText('dashboardPreviousExpenses', '₱0.00');
      setText('dashboardPreviousNetIncome', '₱0.00');
      setText('dashboardRegistrationFee', '₱0.00');
      setText('dashboardYearlyDue', '₱0.00');
      setText('dashboardRiceDebt', '₱0.00');
      setText('dashboardFertilizerDebt', '₱0.00');
      setText('dashboardCashDebt', '₱0.00');
      setText('dashboardOutstanding', '₱0.00');
      setText('dashboardFlowBeginning', '₱0.00');
      setText('dashboardFlowNet', '₱0.00');
      setText('dashboardFlowBalance', '₱0.00');

      const label = document.getElementById('previousMonthLabel');
      if (label) {
        label.textContent = 'Dashboard data unavailable';
        label.title = error.message || 'Dashboard API error';
      }

    }

  }

  document.addEventListener('DOMContentLoaded', loadDashboard);

})();
