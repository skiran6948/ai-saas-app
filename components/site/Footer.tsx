export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex h-16 items-center justify-between text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} AI SaaS</p>
        <div className="flex items-center gap-4">
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-foreground">Twitter</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-foreground">GitHub</a>
        </div>
      </div>
    </footer>
  )
}
