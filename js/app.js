/**
 * ============================================================
 * TOFA FRONTEND APPLICATION
 * ============================================================
 */

let selectedMember =
  null;

let selectedObligations =
  [];


/**
 * ============================================================
 * INITIALIZE
 * ============================================================
 */
document.addEventListener(
  'DOMContentLoaded',
  function() {

    setToday();

    setupNavigation();

    setupCollections();

  }
);


/**
 * ============================================================
 * NAVIGATION
 * ============================================================
 */
function setupNavigation() {

  document
    .querySelectorAll(
      '.nav-item'
    )
    .forEach(
      function(button) {

        button.addEventListener(
          'click',
          function() {

            if (
              button.disabled
            ) {

              return;

            }


            const page =
              button.dataset.page;


            showPage(
              page
            );

          }
        );

      }
    );


  document
    .getElementById(
      'openCollectionsButton'
    )
    .addEventListener(
      'click',
      function() {

        showPage(
          'collections'
        );

      }
    );

}


/**
 * ============================================================
 * SHOW PAGE
 * ============================================================
 */
function showPage(
  page
) {

  document
    .querySelectorAll(
      '.page'
    )
    .forEach(
      function(element) {

        element.classList.add(
          'hidden'
        );

      }
    );


  const target =
    document.getElementById(
      page + 'Page'
    );


  if (!target) {

    return;

  }


  target.classList.remove(
    'hidden'
  );


  document
    .querySelectorAll(
      '.nav-item'
    )
    .forEach(
      function(button) {

        button.classList.remove(
          'active'
        );


        if (
          button.dataset.page ===
          page
        ) {

          button.classList.add(
            'active'
          );

        }

      }
    );


  const titles = {

    dashboard:
      'Dashboard',

    collections:
      'Collections'

  };


  document
    .getElementById(
      'pageTitle'
    )
    .textContent =
    titles[page] ||
    'TOFA';


  document
    .getElementById(
      'pageSubtitle'
    )
    .textContent =
    page === 'collections'
      ? 'Record and manage member payments.'
      : 'TOFA Financial Management System';

}

/**
 * ============================================================
 * DASHBOARD
 * ============================================================
 */

function setupDashboard() {

  loadDashboardSummary();

}


/**
 * ------------------------------------------------------------
 * LOAD DASHBOARD SUMMARY
 * ------------------------------------------------------------
 */

async function loadDashboardSummary() {

  try {

    const currentYear =
      new Date().getFullYear();

    const result =
      await apiGetDashboardSummary(
        currentYear
      );

    if (!result || result.success === false) {

      throw new Error(
        result && result.error
          ? result.error
          : 'Unable to load dashboard summary.'
      );

    }

    setDashboardText(
      'dashboardActiveMembers',
      Number(
        result.activeMembers || 0
      ).toLocaleString('en-PH')
    );

    setDashboardMoney(
      'dashboardRegistrationFee',
      result.registrationFeeOutstanding
    );

    setDashboardMoney(
      'dashboardYearlyDue',
      result.yearlyDueOutstanding
    );

    setDashboardMoney(
      'dashboardCollections',
      result.totalCollections
    );

    setDashboardMoney(
      'dashboardExpenses',
      result.totalExpenses
    );

    setDashboardMoney(
      'dashboardAssociationBalance',
      result.associationBalance
    );

    setDashboardMoney(
      'dashboardOutstanding',
      result.totalOutstanding
    );

    setDashboardMoney(
      'dashboardPreviousCollections',
      result.previousMonthCollections
    );

    const previousTitle =
      document.getElementById(
        'previousCollectionsTitle'
      );

    if (previousTitle) {

      previousTitle.textContent =
        (
          result.previousMonthLabel ||
          'Previous Month'
        ) +
        ' Collections';

    }

  }

  catch (error) {

    console.error(
      'Dashboard error:',
      error
    );

    setDashboardText(
      'dashboardActiveMembers',
      '—'
    );

  }

}


/**
 * ------------------------------------------------------------
 * DASHBOARD TEXT
 * ------------------------------------------------------------
 */

function setDashboardText(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.textContent =
    value;

}


/**
 * ------------------------------------------------------------
 * DASHBOARD MONEY
 * ------------------------------------------------------------
 */

function setDashboardMoney(
  elementId,
  value
) {

  const element =
    document.getElementById(
      elementId
    );

  if (!element) {
    return;
  }

  element.textContent =
    formatCurrency(
      Number(value || 0)
    );

}
/**
 * ============================================================
 * COLLECTIONS SETUP
 * ============================================================
 */
function setupCollections() {

  document
    .getElementById(
      'memberSearchButton'
    )
    .addEventListener(
      'click',
      searchMembers
    );


  document
    .getElementById(
      'memberSearch'
    )
    .addEventListener(
      'keydown',
      function(event) {

        if (
          event.key === 'Enter'
        ) {

          event.preventDefault();

          searchMembers();

        }

      }
    );


  document
    .getElementById(
      'savePaymentButton'
    )
    .addEventListener(
      'click',
      savePayment
    );


  document
    .getElementById(
      'clearPaymentButton'
    )
    .addEventListener(
      'click',
      clearPayment
    );

}


/**
 * ============================================================
 * SEARCH MEMBERS
 * ============================================================
 */
async function searchMembers() {

  const searchText =
    document
      .getElementById(
        'memberSearch'
      )
      .value
      .trim();


  if (!searchText) {

    showStatus(
      'Enter a member name or Member ID.',
      'error'
    );

    return;

  }


  showStatus(
    'Searching members...',
    'info'
  );


  try {

    const result =
      await apiGetMembers();


    const members =
      result.members || [];


    const search =
      searchText.toLowerCase();


    const filtered =
      members.filter(
        function(item) {

          const member =
            item.member ||
            item;


          const id =
            String(
              member['Member ID'] ||
              ''
            ).toLowerCase();


          const name =
            String(
              member['Full Name'] ||
              ''
            ).toLowerCase();


          const address =
            String(
              member['Address'] ||
              ''
            ).toLowerCase();


          return (
            id.includes(search) ||
            name.includes(search) ||
            address.includes(search)
          );

        }
      );


    displayMemberResults(
      filtered
    );


    hideStatus();

  }

  catch (error) {

    showStatus(
      error.message,
      'error'
    );

  }

}


/**
 * ============================================================
 * DISPLAY MEMBER RESULTS
 * ============================================================
 */
function displayMemberResults(
  members
) {

  const container =
    document.getElementById(
      'memberResults'
    );


  container.innerHTML =
    '';


  if (
    !members ||
    members.length === 0
  ) {

    container.innerHTML =
      '<div class="member-result">' +
      'No active member found.' +
      '</div>';

    container.classList.remove(
      'hidden'
    );

    return;

  }


  members.forEach(
    function(item) {

      const member =
        item.member ||
        item;


      const memberId =
        member['Member ID'] ||
        '';


      const name =
        member['Full Name'] ||
        '';


      const address =
        member['Address'] ||
        '';


      const sitio =
        member['Sitio'] ||
        '';


      const div =
        document.createElement(
          'div'
        );


      div.className =
        'member-result';


      div.innerHTML =

        '<div class="member-result-name">' +
        escapeHtml(
          name
        ) +
        '</div>' +

        '<div class="member-result-meta">' +
        escapeHtml(
          memberId
        ) +
        ' • ' +
        escapeHtml(
          address
        ) +
        (
          sitio
            ? ' • ' +
              escapeHtml(
                sitio
              )
            : ''
        ) +
        '</div>';


      div.addEventListener(
        'click',
        function() {

          selectMember(
            memberId
          );

        }
      );


      container.appendChild(
        div
      );

    }
  );


  container.classList.remove(
    'hidden'
  );

}


/**
 * ============================================================
 * SELECT MEMBER
 * ============================================================
 */
async function selectMember(
  memberId
) {

  showStatus(
    'Loading member account...',
    'info'
  );


  try {

    const result =
      await apiGetMemberObligations(
        memberId
      );


    selectedMember =
      result.member;


    displayMember(
      result.member
    );


    renderObligations(
      result.obligations || []
    );


    document
      .getElementById(
        'memberResults'
      )
      .classList.add(
        'hidden'
      );


    hideStatus();

  }

  catch (error) {

    showStatus(
      error.message,
      'error'
    );

  }

}


/**
 * ============================================================
 * DISPLAY MEMBER
 * ============================================================
 */
function displayMember(
  member
) {

  document
    .getElementById(
      'memberId'
    )
    .textContent =
    member.memberId ||
    '—';


  document
    .getElementById(
      'memberName'
    )
    .textContent =
    member.memberName ||
    '—';


  document
    .getElementById(
      'memberAddress'
    )
    .textContent =
    member.address ||
    '—';


  document
    .getElementById(
      'memberSitio'
    )
    .textContent =
    member.sitio ||
    '—';


  document
    .getElementById(
      'memberContact'
    )
    .textContent =
    member.contactNumber ||
    '—';


  document
    .getElementById(
      'memberInfo'
    )
    .classList.remove(
      'hidden'
    );

}


/**
 * ============================================================
 * RENDER OBLIGATIONS
 * ============================================================
 */
function renderObligations(
  obligations
) {

  const container =
    document.getElementById(
      'obligationsList'
    );


  container.innerHTML =
    '';


  selectedObligations =
    [];


  if (
    !obligations ||
    obligations.length === 0
  ) {

    container.innerHTML =
      '<div class="member-result">' +
      'No outstanding obligations.' +
      '</div>';


    document
      .getElementById(
        'obligationsSection'
      )
      .classList.remove(
        'hidden'
      );


    document
      .getElementById(
        'paymentSection'
      )
      .classList.add(
        'hidden'
      );


    return;

  }


  obligations.forEach(
    function(obligation) {

      const id =
        obligation['Obligation ID'] ||
        '';


      const type =
        obligation['Obligation Type'] ||
        '';


      const debtType =
        obligation['Debt Type'] ||
        '';


      const description =
        obligation['Description'] ||
        '';


      const remaining =
        Number(
          obligation['Remaining Balance'] ||
          0
        );


      const row =
        document.createElement(
          'div'
        );


      row.className =
        'obligation-item';


      const details =
        document.createElement(
          'div'
        );


      details.innerHTML =

        '<div class="obligation-name">' +
        escapeHtml(
          type +
          (
            debtType
              ? ' - ' + debtType
              : ''
          )
        ) +
        '</div>' +

        (
          description
            ? '<div class="obligation-description">' +
              escapeHtml(
                description
              ) +
              '</div>'
            : ''
        ) +

        '<div class="obligation-balance">' +
        'Remaining: <strong>' +
        formatCurrency(
          remaining
        ) +
        '</strong>' +
        '</div>';


      const input =
        document.createElement(
          'input'
        );


      input.type =
        'number';

      input.min =
        '0';

      input.max =
        remaining;

      input.step =
        '0.01';

      input.placeholder =
        '₱0.00';

      input.className =
        'amount-input';


      input.dataset.obligationId =
        id;


      input.dataset.remaining =
        remaining;


      input.addEventListener(
        'input',
        updatePaymentSummary
      );


      row.appendChild(
        details
      );

      row.appendChild(
        input
      );


      container.appendChild(
        row
      );

    }
  );


  document
    .getElementById(
      'obligationsSection'
    )
    .classList.remove(
      'hidden'
    );


  document
    .getElementById(
      'paymentSection'
    )
    .classList.remove(
      'hidden'
    );


  updatePaymentSummary();

}


/**
 * ============================================================
 * UPDATE PAYMENT SUMMARY
 * ============================================================
 */
function updatePaymentSummary() {

  const inputs =
    document.querySelectorAll(
      '.amount-input'
    );


  selectedObligations =
    [];


  let total =
    0;


  inputs.forEach(
    function(input) {

      let amount =
        Number(
          input.value
        ) || 0;


      const remaining =
        Number(
          input.dataset.remaining
        ) || 0;


      if (
        amount < 0
      ) {

        amount =
          0;

      }


      if (
        amount > remaining
      ) {

        amount =
          remaining;

        input.value =
          remaining;

      }


      if (
        amount > 0
      ) {

        selectedObligations.push({

          obligationId:
            input.dataset.obligationId,

          amount:
            roundMoney(
              amount
            )

        });


        total +=
          amount;

      }

    }
  );


  total =
    roundMoney(
      total
    );


  document
    .getElementById(
      'selectedCount'
    )
    .textContent =
    selectedObligations.length;


  document
    .getElementById(
      'totalPayment'
    )
    .textContent =
    formatCurrency(
      total
    );


  document
    .getElementById(
      'paymentTotal'
    )
    .value =
    formatCurrency(
      total
    );

}


/**
 * ============================================================
 * SAVE PAYMENT
 * ============================================================
 *
 * NOTE:
 * POST integration will be enabled after we verify the
 * GitHub -> Apps Script GET connection first.
 *
 * ============================================================
 */
async function savePayment() {

  if (!selectedMember) {

    showStatus(
      'Please select a member first.',
      'error'
    );

    return;
  }


  updatePaymentSummary();


  if (
    selectedObligations.length === 0
  ) {

    showStatus(
      'Enter an amount for at least one obligation.',
      'error'
    );

    return;
  }


  const totalAmount =
    selectedObligations.reduce(
      function(total, item) {

        return total +
          Number(item.amount);

      },
      0
    );


  if (totalAmount <= 0) {

    showStatus(
      'Payment amount must be greater than zero.',
      'error'
    );

    return;
  }


  const paymentDate =
    document
      .getElementById('paymentDate')
      .value
      .trim();


  const paymentMethod =
    document
      .getElementById('paymentMethod')
      .value
      .trim();


  const receivedBy =
    document
      .getElementById('receivedBy')
      .value
      .trim();


  const remarks =
    document
      .getElementById('remarks')
      .value
      .trim();


  if (!paymentDate) {

    showStatus(
      'Payment date is required.',
      'error'
    );

    return;
  }


  if (!paymentMethod) {

    showStatus(
      'Payment method is required.',
      'error'
    );

    return;
  }


  if (!receivedBy) {

    showStatus(
      'Received By is required.',
      'error'
    );

    return;
  }


  const button =
    document.getElementById(
      'savePaymentButton'
    );


  if (button.disabled) {
    return;
  }


  const originalButtonText =
    button.textContent;


  try {

    button.disabled = true;

    button.textContent =
      'Saving Payment...';


    showStatus(
      'Saving payment. Please wait...',
      'info'
    );


    const paymentData = {

      memberId:
        selectedMember.memberId,

      paymentDate:
        paymentDate,

      totalAmount:
        roundMoney(totalAmount),

      paymentMethod:
        paymentMethod,

      receivedBy:
        receivedBy,

      remarks:
        remarks,

      allocations:
        selectedObligations.map(
          function(item) {

            return {
              obligationId:
                item.obligationId,

              amount:
                roundMoney(
                  item.amount
                )
            };

          }
        )

    };


    const result =
      await apiRecordMemberPayment(
        paymentData
      );


    showStatus(
      'Payment successfully recorded.',
      'success'
    );


    const successBox =
      document.getElementById(
        'paymentSuccess'
      );


    if (successBox) {

      successBox.classList.remove(
        'hidden'
      );


      successBox.innerHTML =
        '<strong>Payment Recorded</strong>' +
        '<br>' +
        'Receipt No.: ' +
        escapeHtml(
          result.receiptNo ||
          result.collectionId ||
          '—'
        ) +
        '<br>' +
        'Amount: ' +
        formatCurrency(
          result.totalAmount ||
          totalAmount
        );

    }


    /*
     * Reload the member account from the backend.
     * This ensures the frontend displays the actual
     * balances calculated by the server.
     */
    await selectMember(
      selectedMember.memberId
    );


    /*
     * Clear only the payment-entry fields.
     * The selected member remains active.
     */
    document
      .querySelectorAll(
        '.amount-input'
      )
      .forEach(
        function(input) {

          input.value = '';

        }
      );


    document
      .getElementById(
        'receivedBy'
      )
      .value = '';


    document
      .getElementById(
        'remarks'
      )
      .value = '';


    updatePaymentSummary();


  }
  catch (error) {

    showStatus(
      error.message ||
      'Unable to record payment.',
      'error'
    );

  }
  finally {

    button.disabled = false;

    button.textContent =
      originalButtonText;

  }

}

/**
 * ============================================================
 * CLEAR PAYMENT
 * ============================================================
 */
function clearPayment() {

  document
    .querySelectorAll(
      '.amount-input'
    )
    .forEach(
      function(input) {

        input.value =
          '';

      }
    );


  document
    .getElementById(
      'receivedBy'
    )
    .value =
    '';


  document
    .getElementById(
      'remarks'
    )
    .value =
    '';


  document
    .getElementById(
      'paymentSuccess'
    )
    .classList.add(
      'hidden'
    );


  updatePaymentSummary();

  hideStatus();

}


/**
 * ============================================================
 * SET TODAY
 * ============================================================
 */
function setToday() {

  const now =
    new Date();


  const year =
    now.getFullYear();


  const month =
    String(
      now.getMonth() + 1
    ).padStart(
      2,
      '0'
    );


  const day =
    String(
      now.getDate()
    ).padStart(
      2,
      '0'
    );


  document
    .getElementById(
      'paymentDate'
    )
    .value =
    year +
    '-' +
    month +
    '-' +
    day;

}


/**
 * ============================================================
 * STATUS
 * ============================================================
 */
function showStatus(
  message,
  type
) {

  const element =
    document.getElementById(
      'collectionStatus'
    );


  element.textContent =
    message;


  element.className =
    'status ' +
    type;

}


function hideStatus() {

  const element =
    document.getElementById(
      'collectionStatus'
    );


  element.textContent =
    '';


  element.className =
    'status hidden';

}


/**
 * ============================================================
 * FORMAT CURRENCY
 * ============================================================
 */
function formatCurrency(
  amount
) {

  const value =
    Number(
      amount
    ) || 0;


  return '₱' +
    value.toLocaleString(
      'en-PH',
      {
        minimumFractionDigits:
          2,

        maximumFractionDigits:
          2
      }
    );

}


/**
 * ============================================================
 * ROUND MONEY
 * ============================================================
 */
function roundMoney(
  amount
) {

  return Math.round(
    (
      Number(
        amount
      ) || 0
    ) *
    100
  ) / 100;

}


/**
 * ============================================================
 * ESCAPE HTML
 * ============================================================
 */
function escapeHtml(
  value
) {

  return String(
    value == null
      ? ''
      : value
  )
    .replace(
      /&/g,
      '&amp;'
    )
    .replace(
      /</g,
      '&lt;'
    )
    .replace(
      />/g,
      '&gt;'
    )
    .replace(
      /"/g,
      '&quot;'
    )
    .replace(
      /'/g,
      '&#039;'
    );

}
