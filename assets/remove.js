// Sends a removal request. The key below is the public one the apps also use; the server
// only lets it call the functions meant for anonymous visitors.
const ENDPOINT = 'https://zqhxjeceadcmzorjraku.supabase.co/rest/v1/rpc/request_removal';
const PUBLIC_KEY = 'sb_publishable_g_9arcUz41O0hPxREhVkgg__mjRncAT';

const MESSAGES = {
  invalid_phone: "That doesn't look like a phone number. Please check it and try again.",
  note_too_long: 'Please shorten your note to 500 characters.',
  try_later: "We're receiving a lot of requests. Please try again later, or email devrashed01@gmail.com.",
};
const FALLBACK = "Something went wrong. Please check your connection and try again, or email devrashed01@gmail.com.";

const form = document.getElementById('removal');
const phone = document.getElementById('phone');
const note = document.getElementById('note');
const consent = document.getElementById('consent');
const error = document.getElementById('error');
const submit = document.getElementById('submit');
const result = document.getElementById('result');

const reason = async (response) => {
  try {
    return MESSAGES[(await response.json()).message] ?? FALLBACK;
  } catch {
    return FALLBACK;
  }
};

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.textContent = '';
  if (!phone.value.trim()) {
    error.textContent = 'Please enter the phone number.';
    phone.focus();
    return;
  }
  if (!consent.checked) {
    error.textContent = 'Please confirm you can ask for this number to be removed.';
    consent.focus();
    return;
  }

  submit.disabled = true;
  try {
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', apikey: PUBLIC_KEY},
      body: JSON.stringify({p_phone: phone.value, p_note: note.value.trim()}),
    });
    if (response.ok) {
      form.reset();
      form.hidden = true;
      result.hidden = false;
      result.focus();
      return;
    }
    error.textContent = await reason(response);
  } catch {
    error.textContent = FALLBACK;
  }
  submit.disabled = false;
});
