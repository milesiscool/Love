const themeScript = `(() => {
  try {
    const mode = localStorage.getItem('theme-mode') || 'auto';
    const hour = new Date().getHours();
    const autoDark = hour >= 19 || hour < 7;
    const isDark = mode === 'dark' || (mode === 'auto' && autoDark);
    document.documentElement.classList.toggle('dark', isDark);
  } catch {
    document.documentElement.classList.remove('dark');
  }
})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: themeScript }} />;
}
