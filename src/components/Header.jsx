export default function Header() {
  return (
    <div className="bg-white shadow-md m-auto">
      <header className="flex items-center justify-between m-auto p-4 max-w-5xl ">
        <div className="flex items-center space-x-6">
          <img alt="Murni Bank logo" height="" src="/logo.svg" />
          <nav className="flex items-center space-x-6">
            <a className="text-gray-700 font-medium" href="#">
              Home
            </a>
            <a className="text-gray-700 font-medium" href="#">
              Corporation
            </a>
            <a className="text-gray-700 font-medium" href="#">
              Career
            </a>
            <a
              className="text-primary border-b-2 font-medium border-primary"
              href="#"
            >
              Simulasi
            </a>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <input
            className="shadow appearance-none border rounded py-2 px-3  text-gray-700 leading-tight focus:outline-blue-200 focus:shadow-outline  w-full"
            placeholder="Search"
            type="text"
          />
          <img src="/user-circle.svg" className="h-[38px]" alt="" />
        </div>
      </header>
    </div>
  );
}
