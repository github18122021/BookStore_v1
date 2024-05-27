import RemoveIcon from '@mui/icons-material/Remove';
import AddBoxIcon from '@mui/icons-material/AddBox';

import {useState, useContext} from "react";
import axios from "axios";
import { UserContext } from '../../../App';



function BookCard(prop) {
  const {bookPrice, bookImage, setTotalCartItems, setTotalAmount, bookId} = prop;
  let [bookItem, setBookItem] = useState(1);
  
    let user = useContext(UserContext);

      function addToCart() {
      console.log(bookId);

      // validating the input

        if(bookItem === "") {
            setBookItem(1);
        }

        if(bookItem < 1 || typeof Number(bookItem) !== "number" || Number(bookItem) % 1 !== 0){
          alert("Please enter a valid number");
          return;
        }

        // updating the total cart items and total amount
        setTotalCartItems((prevTotalCartItems) => {
            return prevTotalCartItems + Number(bookItem);
        
        })

        setTotalAmount((prevTotalAmount) => {
            
          return Number((prevTotalAmount + parseFloat(bookPrice) * Number(bookItem) ).toFixed(2));
        })

        console.log("user is here", user);
        
        
        async function addToCart() {
          
          try {
            let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/addCart`, {
              bookId,
              userId: user.user,
              quantity: +bookItem
            });

            console.log("Response:", response.data);
          } catch (error) {
            if(error.response.data) {
              console.error("Error:", error.response.data.error);
            }
            console.error("Error:", error.message);
          }
        }

        addToCart();

    }

    /* function addToCart() {
      // validating the input
        if(bookItem === "") {
            setBookItem(1);
        } else {
          
          if(bookItem < 1 || typeof Number(bookItem) !== "number" || Number(bookItem) % 1 !== 0){
            alert("Please enter a valid number");
            return;
          }
        }

        // updating the total cart items and total amount
        setTotalCartItems((prevTotalCartItems) => {
            return prevTotalCartItems + Number(bookItem);
        
        })

        setTotalAmount((prevTotalAmount) => {
            
          return Number((prevTotalAmount + parseFloat(bookPrice) * Number(bookItem) ).toFixed(2));
        })
    } */

    function numOfBooks(e) {
        setBookItem(e.target.value);
    }

  return (
    <>
      <section className="book-card w-fit bg-gray-100 opacity-90 p-2 hover:shadow-lg hover:bg-gray-300">
        <section className="book-image-section">
          <img
            src={bookImage}
            alt="book"
            className="book-image object-cover w-48 h-60"
          />
        </section>

        <section className="book-details p-2">
          <p className="book-price text-center">${bookPrice}</p>

          <section className="book-item flex  mx-auto justify-center">
            <RemoveIcon />
            <input
              type="text"
              name="book-item"
              className="w-14 text-center focus:outline-none focus:border-green-700 border rounded appearance-none"
              onChange={numOfBooks}
            />
            <AddBoxIcon />
          </section>

          <section className="add-to-cart">

            <button className="bg-green-700 text-white w-full p-2 rounded" onClick={addToCart}>
              Add to Cart
            </button>
            
          </section>
        </section>
      </section>
    </>
  );
}

export default BookCard;
