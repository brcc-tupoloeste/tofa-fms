/**
 * ============================================================
 * TOFA FINANCIAL MANAGEMENT SYSTEM
 * FRONTEND API SERVICE
 * ============================================================
 */

const TOFA_API_URL =
  'https://script.google.com/macros/s/AKfycbybRrN6IH2Gvn5e07mJ2SmkbAhGUpInZ5CQF9SeBK4nDkLjRJ6fORR4zZhIQbT2Vwbpyg/exec';


/**
 * ============================================================
 * GET API
 * ============================================================
 */
async function apiGet(
  action,
  params = {}
) {

  if (!action) {

    throw new Error(
      'API action is required.'
    );

  }


  const query =
    new URLSearchParams();


  query.set(
    'api',
    '1'
  );


  query.set(
    'action',
    action
  );


  Object.keys(
    params
  ).forEach(
    function(key) {

      const value =
        params[key];


      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ''
      ) {

        query.set(
          key,
          String(value)
        );

      }

    }
  );


  const response =
    await fetch(
      TOFA_API_URL +
      '?' +
      query.toString(),
      {
        method: 'GET',
        cache: 'no-store'
      }
    );


  if (!response.ok) {

    throw new Error(
      'API request failed: HTTP ' +
      response.status
    );

  }


  let result;


  try {

    result =
      await response.json();

  }
  catch (error) {

    throw new Error(
      'API returned an invalid response.'
    );

  }


  if (
    !result ||
    result.success !== true
  ) {

    throw new Error(
      result &&
      result.error
        ? result.error
        : 'API request failed.'
    );

  }


  return result;

}


/**
 * ============================================================
 * POST API
 *
 * text/plain is intentional.
 *
 * This avoids a JSON CORS preflight when sending requests
 * from the GitHub Pages frontend to Google Apps Script.
 * ============================================================
 */
async function apiPost(
  action,
  data = {}
) {

  if (!action) {

    throw new Error(
      'API action is required.'
    );

  }


  const payload = {

    action:
      action,

    data:
      data

  };


  const response =
    await fetch(
      TOFA_API_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type':
            'text/plain;charset=utf-8'
        },

        body:
          JSON.stringify(
            payload
          )
      }
    );


  if (!response.ok) {

    throw new Error(
      'API request failed: HTTP ' +
      response.status
    );

  }


  let result;


  try {

    result =
      await response.json();

  }
  catch (error) {

    throw new Error(
      'API returned an invalid response.'
    );

  }


  if (
    !result ||
    result.success !== true
  ) {

    throw new Error(
      result &&
      result.error
        ? result.error
        : 'API request failed.'
    );

  }


  return result;

}


/**
 * ============================================================
 * MEMBERS
 * ============================================================
 */
function apiGetMembers() {

  return apiGet(
    'members'
  );

}


/**
 * ============================================================
 * MEMBER OBLIGATIONS
 * ============================================================
 */
function apiGetMemberObligations(
  memberId
) {

  if (!memberId) {

    throw new Error(
      'Member ID is required.'
    );

  }


  return apiGet(
    'memberobligations',
    {
      memberId:
        memberId
    }
  );

}


/**
 * ============================================================
 * MEMBER HISTORY
 * ============================================================
 */
function apiGetMemberHistory(
  memberId
) {

  if (!memberId) {

    throw new Error(
      'Member ID is required.'
    );

  }


  return apiGet(
    'memberhistory',
    {
      memberId:
        memberId
    }
  );

}


/**
 * ============================================================
 * RECORD MEMBER PAYMENT
 * ============================================================
 */
function apiRecordMemberPayment(
  data
) {

  if (
    !data ||
    typeof data !== 'object'
  ) {

    throw new Error(
      'Payment data is required.'
    );

  }


  return apiPost(
    'recordmemberpayment',
    data
  );

}


/**
 * ============================================================
 * DASHBOARD
 *
 * These functions are prepared for the Dashboard API.
 *
 * They should only be used after the corresponding backend
 * actions have been added to 06_WebApi.gs.
 * ============================================================
 */


/**
 * Get complete Dashboard summary.
 *
 * Expected backend action:
 *
 * dashboardsummary
 *
 * Expected future response structure:
 *
 * {
 *   success: true,
 *   dashboard: {
 *     activeMembers: 0,
 *     registrationCollection: 0,
 *     yearlyDueCollection: 0,
 *     totalCollections: 0,
 *     totalExpenses: 0,
 *     associationBalance: 0
 *   }
 * }
 */
function apiGetDashboardSummary(
  year
) {

  const params = {};


  if (
    year !== undefined &&
    year !== null &&
    String(year).trim() !== ''
  ) {

    params.year =
      String(year);

  }


  return apiGet(
    'dashboardsummary',
    params
  );

}


/**
 * ============================================================
 * DASHBOARD MEMBERS
 * ============================================================
 *
 * Optional separate endpoint if needed later.
 * ============================================================
 */
function apiGetDashboardMembers() {

  return apiGet(
    'members'
  );

}


/**
 * ============================================================
 * API CONNECTION TEST
 * ============================================================
 */
async function apiTestConnection() {

  try {

    const result =
      await apiGetMembers();


    return {

      success:
        true,

      message:
        'TOFA API connection successful.',

      result:
        result

    };

  }
  catch (error) {

    return {

      success:
        false,

      message:
        error.message ||
        'TOFA API connection failed.'

    };

  }

}
