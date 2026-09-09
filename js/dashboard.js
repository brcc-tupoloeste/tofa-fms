/**
 * ============================================================
 * TOFA FINANCIAL MANAGEMENT SYSTEM
 * FILE: dashboard.js
 * FINAL DASHBOARD
 * ============================================================
 * ORDER:
 * 1. Previous Month
 * 2. Current Month / Financial Overview
 * 3. Outstanding Obligations
 * 4. Financial Statement
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

  function number(value) {
    return Number(value || 0).toLocaleString('en-PH');
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = value;
    }
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

      /* Header */
      setText('dashboardYear', result.year);
      setText('dashboardYearBadge', result.year);

      /* 1. Previous Month */
      setText(
        'previousMonthLabel',
        result.previousMonthLabel || 'Previous Month'
      );
      setText(
        'dashboardPreviousBalance',
        money(result.previousBalance)
      );
      setText(
        'dashboardPreviousCollections',
        money(result.previousMonthCollections)
      );
      setText(
        'dashboardPreviousExpenses',
        money(result.previousMonthExpenses)
      );
      setText(
        'dashboardPreviousNetIncome',
        money(result.previousMonthNetIncome)
      );

      /* 2. Current Month / Financial Overview */
      setText(
        'dashboardActiveMembers',
        number(result.activeMembers)
      );
      setText(
        'dashboardBeginningBalance',
        money(result.beginningBalance)
      );
      setText(
        'dashboardCollections',
        money(result.totalCollections)
      );
      setText(
        'dashboardExpenses',
        money(result.totalExpenses)
      );
      setText(
        'dashboardNetIncome',
        money(result.netIncome)
      );
      setText(
        'dashboardAssociationBalance',
        money(result.associationBalance)
      );

      /* 3. Outstanding Obligations */
      setText(
        'dashboardRegistrationFee',
        money(result.registrationFeeOutstanding)
      );
      setText(
        'dashboardYearlyDue',
        money(result.yearlyDueOutstanding)
      );
      setText(
        'dashboardRiceDebt',
        money(result.riceDebtOutstanding)
      );
      setText(
        'dashboardFertilizerDebt',
        money(result.fertilizerDebtOutstanding)
      );
      setText(
        'dashboardCashDebt',
        money(result.cashDebtOutstanding)
      );
      setText(
        'dashboardOutstanding',
        money(result.totalOutstanding)
      );

      /* 4. Financial Statement */
      setText(
        'dashboardPositionBeginning',
        money(result.beginningBalance)
      );
      setText(
        'dashboardPositionNetIncome',
        money(result.netIncome)
      );
      setText(
        'dashboardPositionBankBalance',
        money(result.bankBalance)
      );
      setText(
        'dashboardPositionBalance',
        money(
          result.totalAssociationBalance !== undefined
            ? result.totalAssociationBalance
            : result.associationBalance
        )
      );

    } catch (error) {
      console.error(
        'TOFA Dashboard Error:',
        error
      );
    }
  }

  document.addEventListener(
    'DOMContentLoaded',
    loadDashboard
  );

})();
