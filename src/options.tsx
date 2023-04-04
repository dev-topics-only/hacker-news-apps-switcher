function IndexOptions() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: 16,
        width: "500px",
      }}>
      <h1>Hacker News Apps Switcher</h1>
      <ul
        style={{
          display: "flex",
          flexDirection: "column",
          listStyleType: "none",
          padding: 16,
        }}>
        <li>
          <a
            href="https://github.com/dev-topics-only/hacker-news-apps-switcher#readme"
            target="_blank">
            Home
          </a>
        </li>
        <li>
          <a
            href="https://github.com/dev-topics-only/hacker-news-apps-switcher/issues"
            target="_blank">
            Report issue
          </a>
        </li>
      </ul>
      <footer>
        Made with ❤️ by{" "}
        <a href="https://www.pipecraft.net/" target="_blank">
          Pipecraft
        </a>
      </footer>
    </div>
  )
}

export default IndexOptions
