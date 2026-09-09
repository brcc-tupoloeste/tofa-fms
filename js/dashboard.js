/**
 * ============================================================
 * TOFA FINANCIAL MANAGEMENT SYSTEM
 * DASHBOARD V2
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

    const el =
      document.getElementById(id);

    if (el) {
      el.textContent = value;
    }

  }


  async function loadDashboard() {

    try {

      const currentYear =
        new Date().getFullYear();


      const result =
        await apiGetDashboardSummary(
          currentYear
        );


      if (
        !result ||
        result.success !== true
      ) {

        throw new Error(
          result &&
          result.error
            ? result.error
            : 'Dashboard data could not be loaded.'
        );

      }


      /*
       * ========================================================
       * HEADER
       * ========================================================
       */

      setText(
        'dashboardYear',
        result.year
      );

      setText(
        'dashboardYearBadge',
        result.year
      );


      /*
       * ========================================================
       * FINANCIAL OVERVIEW
       * ========================================================
       */

      setText(
        'dashboardActiveMembers',
        Number(
          result.activeMembers || 0
        ).toLocaleString('en-PH')
      );


      setText(
        'dashboardBeginningBalance',
        money(
          result.beginningBalance
        )
      );


      setText(
        'dashboardCollections',
        money(
          result.totalCollections
        )
      );


      setText(
        'dashboardExpenses',
        money(
          result.totalExpenses
        )
      );


      setText(
        'dashboardNetIncome',
        money(
          result.netIncome
        )
      );


      setText(
        'dashboardAssociationBalance',
        money(
          result.associationBalance
        )
      );


      /*
       * ========================================================
       * PREVIOUS MONTH
       * ========================================================
       */

      setText(
        'previousMonthLabel',
        result.previousMonthLabel ||
        'Previous Month'
      );


      setText(
        'dashboardPreviousBalance',
        money(
          result.previousBalance
        )
      );


      setText(
        'dashboardPreviousCollections',
        money(
          result.previousMonthCollections
        )
      );


      setText(
        'dashboardPreviousExpenses',
        money(
          result.previousMonthExpenses
        )
      );


      setText(
        'dashboardPreviousNetIncome',
        money(
          result.previousMonthNetIncome
        )
      );


      /*
       * ========================================================
       * OUTSTANDING OBLIGATIONS
       * ========================================================
       */

      setText(
        'dashboardRegistrationFee',
        money(
          result.registrationFeeOutstanding
        )
      );


      setText(
        'dashboardYearlyDue',
        money(
          result.yearlyDueOutstanding
        )
      );


      setText(
        'dashboardRiceDebt',
        money(
          result.riceDebtOutstanding
        )
      );


      setText(
        'dashboardFertilizerDebt',
        money(
          result.fertilizerDebtOutstanding
        )
      );


      setText(
        'dashboardCashDebt',
        money(
          result.cashDebtOutstanding
        )
      );


      setText(
        'dashboardOutstanding',
        money(
          result.totalOutstanding
        )
      );


      /*
       * ========================================================
       * FINANCIAL POSITION
       * ========================================================
       */

      setText(
        'dashboardPositionBeginning',
        money(
          result.beginningBalance
        )
      );


      setText(
        'dashboardPositionNetIncome',
        money(
          result.netIncome
        )
      );


      setText(
        'dashboardPositionBalance',
        money(
          result.associationBalance
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
