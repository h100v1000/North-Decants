const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function initGoogleSignIn() {
  try {
    google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredentialResponse });
    const container = document.getElementById('googleSignInContainer');
    if (container && !container.querySelector('[data-client_id]')) {
      google.accounts.id.renderButton(container, { theme: 'filled_black', size: 'large', width: '100%' });
    }
  } catch (error) {
    console.log('Set your GOOGLE_CLIENT_ID in auth.js');
  }
}

function handleCredentialResponse(response) {
  try {
    const base64Url = response.credential.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const userInfo = JSON.parse(jsonPayload);
    localStorage.setItem('user', JSON.stringify({ name: userInfo.name, email: userInfo.email, picture: userInfo.picture }));
    closeAuthModal();
    updateAuthUI();
    showToast(`Welcome, ${userInfo.name}!`);
  } catch (error) {
    console.error('Error handling sign-in:', error);
  }
}

function logout() {
  try { google.accounts.id.disableAutoSelect(); } catch (e) {}
  localStorage.removeItem('user');
  updateAuthUI();
}

function updateAuthUI() {
  const user = JSON.parse(localStorage.getItem('user'));
  const authOption = document.getElementById('authOption');
  const profileOption = document.getElementById('profileOption');
  if (user && authOption && profileOption) { authOption.style.display = 'none'; profileOption.style.display = 'block'; }
  else if (authOption && profileOption) { authOption.style.display = 'block'; profileOption.style.display = 'none'; }
}

function openAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) { modal.style.display = 'flex'; setTimeout(() => initGoogleSignIn(), 100); }
}

function closeAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) { modal.style.display = 'none'; }
}

window.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById('loginBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const closeBtn = document.getElementById('closeAuthBtn');
  const authModal = document.getElementById('authModal');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');
  if (loginBtn) loginBtn.addEventListener('click', openAuthModal);
  if (logoutBtn) logoutBtn.addEventListener('click', logout);
  if (closeBtn) closeBtn.addEventListener('click', closeAuthModal);
  if (authModal) authModal.addEventListener('click', (e) => { if (e.target.id === 'authModal') closeAuthModal(); });
  if (hamburgerBtn) hamburgerBtn.addEventListener('click', () => { hamburgerBtn.classList.toggle('active'); if (mobileNav) mobileNav.classList.toggle('active'); });
  if (mobileNav) mobileNav.querySelectorAll('a').forEach((link) => { link.addEventListener('click', () => { if (hamburgerBtn) hamburgerBtn.classList.remove('active'); if (mobileNav) mobileNav.classList.remove('active'); }); });
  updateAuthUI();
});

function showToast(message) {
  const toast = document.getElementById('cart-toast');
  if (toast) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => { toast.classList.remove('show'); }, 2500); }
}