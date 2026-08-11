/**
 * Copies text to the clipboard, working even outside a secure context.
 *
 * `navigator.clipboard` only exists on HTTPS or localhost — on a plain HTTP
 * deployment (e.g. an internal IP like http://172.16.0.151) it's simply
 * absent, so the modern API silently can't be used. This falls back to the
 * legacy `execCommand('copy')` trick via a hidden textarea, which still
 * works over plain HTTP.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy method below.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.pointerEvents = 'none';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();

  let succeeded = false;
  try {
    succeeded = document.execCommand('copy');
  } catch {
    succeeded = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return succeeded;
}
