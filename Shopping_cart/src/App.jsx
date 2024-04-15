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
  
  useEffect(() => {
    const token = window.localStorage.getItem("token");

    if (!token) {
      // Redirect to login if token is missing
      window.location.href = "/login";
      return;
    }

    // Check if token is valid
    const checkToken = async () => {
      try {
        const response = await axios.get("http://localhost:3000/verify", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });
        // Handle successful verification
        console.log("Response:", response.data);

        if (response.data.userId) {
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

    checkToken();
  }, []);

  useEffect(() => {
    console.log("User:", user);

    async function getUser() {
      try {
        let response = await axios.post("http://localhost:3000/user", {
          userId: user,
        });

        // an array of objects: collections
        let data = response.data[0];

        calculateTotalCartItems(data);

        // if (data.books.length > 0) {
        //   console.log(data.books);
        //   console.log("do sp");
        //   setTotalCartItems(data.books.length);
        // }

        calculateTotalAmount(data);


      } catch (error) {
        if (error.response) {
          console.error("Error:", error.response.data.error);
        }
      }
    }

    
    if(user) {
      getUser();
    }

  }, [user]);



  function calculateTotalCartItems(data) {
    
    let totalItems = 0;

    if (data.books.length > 0) {
      data.books.forEach((book) => {
        totalItems += book.quantity;
      });

      // set total cart items
      setTotalCartItems(totalItems);
    }

    // if not data.books.length > 0, 0 items in cart by default
  }

  function calculateTotalAmount(data) {
    let totalAmount = 0;

    if(data.books.length > 0) {
      data.books.forEach((book) => {
        totalAmount += book.quantity * book.book.price;
        setTotalAmount(Number(totalAmount.toFixed(2)));
      })
    }
  }

  return (
    <>
      {/* <Header
        setBooksToDisplay={setBooksToDisplay}
        totalCartItems={totalCartItems}
        totalAmount={totalAmount}
      />
      <Main
        booksToDisplay={booksToDisplay}
        setTotalCartItems={setTotalCartItems}
        setTotalAmount={setTotalAmount}
      /> */}

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
