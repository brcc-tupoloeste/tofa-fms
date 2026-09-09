const TOFA_API_URL =
  'https://script.google.com/macros/s/AKfycbybRrN6IH2Gvn5e07mJ2SmkbAhGUpInZ5CQF9SeBK4nDkLjRJ6fORR4zZhIQbT2Vwbpyg/exec';

async function apiGet(action, params = {}) {

  const query = new URLSearchParams();

  query.append('api', '1');
  query.append('action', action);

  for (const key in params) {
    if (
      params[key] !== undefined &&
      params[key] !== null &&
      String(params[key]).trim() !== ''
    ) {
      query.append(key, String(params[key]));
    }
  }

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


function apiGetMembers() {
  return apiGet('members');
}


function apiGetMemberObligations(memberId) {

  if (!memberId) {
    throw new Error('Member ID is required.');
  }

  return apiGet(
    'memberobligations',
    {
      memberId: memberId
    }
  );
}


function apiGetMemberHistory(memberId) {

  if (!memberId) {
    throw new Error('Member ID is required.');
  }

  return apiGet(
    'memberhistory',
    {
      memberId: memberId
    }
  );
}
