function PageContent({ title, children }) {
  return (
    <div className="container mx-auto py-8">
      {title && (
        <div className="text-center p-2 m-4">
          <h1>{title}</h1>
        </div>
      )}
      {children}
    </div>
  );
}

export default PageContent;
