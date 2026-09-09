const TOFA_API_URL =
  'https://script.google.com/macros/s/AKfycbybRrN6IH2Gvn5e07mJ2SmkbAhGUpInZ5CQF9SeBK4nDkLjRJ6fORR4zZhIQbT2Vwbpyg/exec';


/**
 * ============================================================
 * TOFA API GET
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

  const url =
    TOFA_API_URL +
    '?' +
    query.toString();

  const response =
    await fetch(url, {
      method: 'GET',
      cache: 'no-store'
    });

  if (!response.ok) {

    throw new Error(
      'API request failed: HTTP ' +
      response.status
    );

  }

  const result =
    await response.json();

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
 * GET MEMBERS
 * ============================================================
 */
async function apiGetMembers() {

  return apiGet('members');

}


/**
 * ============================================================
 * GET MEMBER OBLIGATIONS
 * ============================================================
 */
async function apiGetMemberObligations(memberId) {

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
 * GET MEMBER HISTORY
 * ============================================================
 */
async function apiGetMemberHistory(memberId) {

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
