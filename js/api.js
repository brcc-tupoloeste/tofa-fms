const TOFA_API_URL =
  'https://script.google.com/macros/s/AKfycbybRrN6IH2Gvn5e07mJ2SmkbAhGUpInZ5CQF9SeBK4nDkLjRJ6fORR4zZhIQbT2Vwbpyg/exec';


/**
 * ============================================================
 * GET API
 * ============================================================
 */
async function apiGet(action, params = {}) {

  const query = new URLSearchParams();

  query.set('api', '1');
  query.set('action', action);

  Object.keys(params).forEach(function(key) {

    const value = params[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {
      query.set(key, String(value));
    }

  });

  const response = await fetch(
    TOFA_API_URL + '?' + query.toString(),
    {
      method: 'GET',
      cache: 'no-store'
    }
  );

  if (!response.ok) {
    throw new Error(
      'API request failed: HTTP ' + response.status
    );
  }

  const result = await response.json();

  if (!result || result.success !== true) {
    throw new Error(
      result && result.error
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
 * It allows the browser to send the Apps Script request
 * without requiring a JSON CORS preflight.
 * ============================================================
 */
async function apiPost(action, data = {}) {

  const payload = {
    action: action,
    data: data
  };

  const response = await fetch(
    TOFA_API_URL,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(payload)
    }
  );

  if (!response.ok) {
    throw new Error(
      'API request failed: HTTP ' + response.status
    );
  }

  const result = await response.json();

  if (!result || result.success !== true) {
    throw new Error(
      result && result.error
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
  return apiGet('members');
}


/**
 * ============================================================
 * MEMBER OBLIGATIONS
 * ============================================================
 */
function apiGetMemberObligations(memberId) {

  if (!memberId) {
    throw new Error(
      'Member ID is required.'
    );
  }

  return apiGet(
    'memberobligations',
    {
      memberId: memberId
    }
  );
}


/**
 * ============================================================
 * MEMBER HISTORY
 * ============================================================
 */
function apiGetMemberHistory(memberId) {

  if (!memberId) {
    throw new Error(
      'Member ID is required.'
    );
  }

  return apiGet(
    'memberhistory',
    {
      memberId: memberId
    }
  );
}


/**
 * ============================================================
 * RECORD MEMBER PAYMENT
 * ============================================================
 */
function apiRecordMemberPayment(data) {

  return apiPost(
    'recordmemberpayment',
    data
  );

}
