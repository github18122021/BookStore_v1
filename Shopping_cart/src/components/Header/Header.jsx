import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';
// import axios from "axios";

import {useState} from "react";

function Header(prop) {
  let [searchedBook, setSearchedBook] = useState("");
  let {setBooksToDisplay, totalCartItems, totalAmount, user} = prop;

  console.log(user);
  


  // keyDown function to search book
  function searchBook(e) {

    // if enter key is pressed or search icon is clicked
    if(e.key === "Enter" || e.type === "click") {

      setBooksToDisplay(searchedBook);
    }
  }

  // onChange function to get searched book
  function getSearchedBook(e) {
    // making the final word to be searched 
    setSearchedBook(e.target.value);

    // live changes
    setBooksToDisplay(searchedBook);
  }

  function handleLogOut() {
    window.localStorage.removeItem("token");
    window.location.href = "/login";
  }

  return (
    <>
      <header className="flex justify-between bg-gray-200">
        
        <h1 className="text-5xl text-green-700 ml-4">Book Store</h1>

        <section className="book-search-section   book-search justify-center my-auto">

          <section className="book-search-wrapper flex border-2 border-green-700 w-30">
            <input
              type="search"
              placeholder="Search for books"
              className="h-fit border-2 border-solid outline-none"
              onKeyDown={searchBook}
              onChange={getSearchedBook}
            />

            <section className="search-icon-section w-20 text-center bg-green-700 text-white">
              <SearchIcon onClick={searchBook}/>
            </section>
          </section>

        </section>

        <section className="cart-section mt-1 mr-4">

          <section className="cart-wrapper flex">

          <section className="cart-details mr-8">
            <p>Num of Items: {totalCartItems}</p>
            <p>Total Amount: ${totalAmount}</p>
          </section>

          <section className="cart-icon-section my-auto mr-3">
            <ShoppingCartIcon className="text-green-700" fontSize="large"/>
            <LogoutIcon className="text-red-700 ml-2" fontSize="large" onClick={handleLogOut}/>
          </section>
          </section>
        </section>
      </header>
    </>
  )
}

export default Header
