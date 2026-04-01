interface PageLayoutProps {
  children: React.ReactNode
  title: string
}

export function PageLayout({ children, title }: PageLayoutProps) {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">{title}</h1>
      {children}
    </div>
  )
}
