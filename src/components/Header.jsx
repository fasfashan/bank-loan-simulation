export default function Header() {
  return (
    <div className="bg-white sticky top-0 z-10 shadow-md m-auto">
      <header className="flex items-center justify-between m-auto px-8 py-4 max-w-5xl ">
        <div className="flex items-center space-x-6">
          <a href="/">
            <img alt="Murni Bank logo" height="" src="/logo.svg" />
          </a>
        </div>
        <div className="flex items-center space-x-4">
          <img src="/user-circle.svg" className="h-[38px]" alt="" />
        </div>
      </header>
    </div>
  );
}
