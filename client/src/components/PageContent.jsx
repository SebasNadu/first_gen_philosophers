function PageContent({ title, children }) {
  return (
    <div className="container px-8 mx-auto my-4">
      <div className="text-center m-4">
        <h1>{title}</h1>
      </div>
      {children}
    </div>
  );
}

export default PageContent;
