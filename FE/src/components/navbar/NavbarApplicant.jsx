"use client"; 

const NavbarApplicant = () => {
  return (
    <div className="flex justify-center items-center fixed w-full h-[72px] bg-white font-outfit z-50 border-b-2">
      <div className="flex flex-row gap-x-[700px]">
        <div className="text-[#05192D]">
          Logo
        </div>
        <div className="flex flex-row gap-x-[35px] text-lg">
          <div
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:underline transition-all duration-500"
            onClick={() => { /* Handle Sign Up */ }}
          >
            Sign Up
          </div>
          <div 
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:underline"
            onClick={() => { /* Handle Sign Up */ }}
          >
            Login
          </div>
          <div 
            className="flex justify-center items-center text-[#05192D] cursor-pointer hover:bg-[#03FE62] transition-all duration-200 border-[2px] border-[#03FE62] rounded-[10px] px-[10px] h-[38px]"
            onClick={() => { /* Handle Sign Up */ }}
          >
            Untuk Rekruiter
          </div>
        </div>
      </div>
    </div>
  )
}

export default NavbarApplicant
