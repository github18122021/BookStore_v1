import axios from "axios";
import Header from "./components/Header/Header";
import Main from "./components/Main/Main";
import { useState, useEffect } from "react";
import { createContext } from "react";


export let UserContext = createContext();

function App() {
  const [booksToDisplay, setBooksToDisplay] = useState("");
  const [totalCartItems, setTotalCartItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  
  // check if token is present, then verify the validity of the token
  // if not present, redirect to login
  // running only once when the component is mounted
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      // Redirect to login if token is missing
      window.location.href = "/login";
      return;
    }

    // Check if token is valid
    const checkToken = async () => {

      // Verify token

      try {
        // Send a GET request to the server to verify the token
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/verify`, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        // If the token is valid, the server will respond with the user ID
        // If the token is invalid, the server will respond with an error message

        // Handle successful verification
        console.log("Response:", response.data);

        if (response.data.userId) {
          // Set the user ID in the state
          // Set the isAuthenticated state to true
          setUser(response.data.userId);
          setIsAuthenticated(true);
        }

      } catch (error) {
        // Handle errors (token is invalid or expired)
        console.error("Error:", error.message);

        // Redirect to login if token is not valid
        window.location.href = "/login";
      }
    };

    // Call the checkToken function
    checkToken();

    // this will run only once when the component is mounted
  }, []);


  // running every time the user changes
  useEffect(() => {

    console.log("User:", user);

    // get user data
    // this function will run only if user is not null
    async function getUser() {

      try {

        // Send a POST request to the server to get the user data
        // user is the user ID from the jwt token

        let response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user`, {
          userId: user,
        });

        // an array of objects: collections
        // getting data from the response
        let data = response.data[0];
        
        // pass the data to the function to calculate total cart items
        calculateTotalCartItems(data);

        // pass the data to the function to calculate total amount
        calculateTotalAmount(data);


      } catch (error) {

        // Handle errors
        if (error.response) {
          console.error("Error:", error.response.data.error);
        }
      }
    }

    // if user is not null, get user data
    if(user) {
      getUser();
    }

  }, [user]);



  // function to calculate total cart items
  function calculateTotalCartItems(data) {
    
    let totalItems = 0;

    // if data.books.length > 0, calculate total items
    // if not, 0 items in cart by default
    if (data.books.length > 0) {
      data.books.forEach((book) => {
        totalItems += book.quantity;
      });

      // set total cart items
      setTotalCartItems(totalItems);
    }

    // if not data.books.length > 0, 0 items in cart by default
  }

  // function to calculate total amount
  function calculateTotalAmount(data) {
    let totalAmount = 0;

    // if data.books.length > 0, calculate total amount
    // if not, 0 amount by default
    if(data.books.length > 0) {
      data.books.forEach((book) => {
        totalAmount += book.quantity * book.book.price;
        setTotalAmount(Number(totalAmount.toFixed(2)));
      })
    }
  }

  return (
    <>
      <UserContext.Provider value={{ user }}>
      {isAuthenticated ? (
        <>
          <Header
            setBooksToDisplay={setBooksToDisplay}
            totalCartItems={totalCartItems}
            totalAmount={totalAmount}
            user={user}
          />
          <Main
            booksToDisplay={booksToDisplay}
            setTotalCartItems={setTotalCartItems}
            setTotalAmount={setTotalAmount}
          />
        </>
      ) : (
        <h1 className="text">Not Authenticated</h1>
      )}
      </UserContext.Provider>
    </>
  );
}

export default App;
