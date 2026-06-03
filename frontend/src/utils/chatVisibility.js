const HIDDEN_CHAT_ROUTES = new Set(['/login', '/register', '/verify-otp']);

export function shouldShowChatWidget(pathname) {
  return !HIDDEN_CHAT_ROUTES.has(pathname);
}
