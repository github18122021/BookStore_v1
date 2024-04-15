import BookCard from "./BookCard/BookCard"
// import books from "../../db/books.json";

import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";


function Main(prop) {
  let {booksToDisplay, setTotalCartItems, setTotalAmount} = prop;

  // pagination
  let [currentPage, setCurrentPage] = useState(1);
  let [booksPerPage] = useState(3);


  // data fetching (getting books:)
  const {data, isLoading, isError} = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      let response = await axios("http://localhost:3000/books");

      return response.data;
    }
  })

  
  // console.log(currentBooks);
  
  if(isError) {
    return <h1>Error occurred while fetching data!</h1>
  }
  
  if(isLoading) {
    return <h1>Loading...</h1>
  }
  
  // pagination (if data is fetched successfully:)

  let indexOfLastBook = Math.min(currentPage * booksPerPage, data.length);
  let indexOfFirstBook = Math.max(indexOfLastBook - booksPerPage, 0);

  console.log(indexOfFirstBook, indexOfLastBook)

  let currentBooks = data.slice(indexOfFirstBook, indexOfLastBook);

  let pageNumbers = Math.ceil(data.length / booksPerPage);
  let paginateButtons = [];

  for (let i = 1; i <= pageNumbers; i++) {
    paginateButtons.push(i);
  }

  function paginateFn(pageNum) {
    setCurrentPage(pageNum);
  }
  console.log(data);
  console.log(currentBooks);
  
  return (
    <>
      <main>

        {/* book section */}
        <section className="books-section p-10">
          
        <section className="books-wrapper grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 w-fit max-w-screen-xl mx-auto">

            {/* {
              books.map((book, index) => {
                return <BookCard key={index} bookImage={book.image} bookPrice={book.price} />
              })
            } */}

            {
              (booksToDisplay !== "") ? 
              <>
              {
                currentBooks.map((book, index) => {

                  if(book.name.toLowerCase().includes(booksToDisplay.toLowerCase())) {
                    return <BookCard key={index} bookImage={book.image} bookPrice={book.price} setTotalCartItems = {setTotalCartItems} setTotalAmount = {setTotalAmount} bookId={book._id}/>
                  }
                })
              }
              </>
              :
              <>{
                currentBooks.map((book, index) => {
                  return <BookCard key={index} bookImage={book.image} bookPrice={book.price} setTotalCartItems = {setTotalCartItems} setTotalAmount = {setTotalAmount} bookId={book._id}/>
                })
              
              }</>
            }
            
          </section>

          {/* pagination section */}
          <section className="pagination-section">
            
            <section className="pagination-wrapper w-fit mx-auto">
              {
                (paginateButtons.length > 0) ? 
                <>
                {
                  paginateButtons.map((buttonNum, index) => {
                    return <button key={index} className="ml-2 mr-2 border-2 rounded-xl text-white bg-green-700 px-3 py-1" onClick={() => paginateFn(buttonNum)}>{buttonNum}</button>
                  })
                }
                </> : 
                <>
                {
                  <button>1</button>
                }
                </>
              }
            </section>
          </section>

        </section>
      </main>
    </>
  )
}

export default Main
