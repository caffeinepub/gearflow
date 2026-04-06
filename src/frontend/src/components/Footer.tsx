export default function Footer() {
  const year = new Date().getFullYear();
  const href = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`;
  return (
    <footer
      className="w-full mt-auto py-4"
      style={{
        background: "oklch(0.18 0.012 240 / 0.95)",
        borderTop: "1px solid oklch(0.32 0.01 240)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs" style={{ color: "oklch(0.50 0.01 240)" }}>
            © {year} GearFlow — Hardware Tool Management
          </span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs transition-colors"
          style={{ color: "oklch(0.50 0.01 240)" }}
        >
          Built with ❤️ using{" "}
          <span style={{ color: "oklch(0.67 0.16 55)" }}>caffeine.ai</span>
        </a>
      </div>
    </footer>
  );
}
