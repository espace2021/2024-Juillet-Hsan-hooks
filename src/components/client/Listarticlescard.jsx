
import React, { useEffect, useState } from 'react'
import {fetcharticlesPagination} from "../../services/articleservice"
import Card from './Card';
import Pagination from '../articles/Pagination';
import "./stylecard.css"

const Listarticlescard = () => {
    const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit]=useState(18)
  const [articles, setArticles] = useState([]);
  
    const fetchProducts = async (page,limit) => {
        try {
          const res = await fetcharticlesPagination(page,limit,'')
         
          setArticles(res.data.products);
          setTotalPages(res.data.totalPages);
          console.log(res.data.products)
        } catch (error) {
          console.log(error);
        }
      };
     useEffect(() => {
       
        fetchProducts(currentPage,limit,'');
      }, [currentPage,limit]);
      const handlePrevPage = () => {
        if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      };
    
      const handleNextPage = () => {
        if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      };
      const handlePageChange = (page) => {
        setCurrentPage(page);
      };
    

  
  return (
    <>
 <div className="card-container">
      {articles.map((art,index)=>
        <Card  imageart={art.imageart}
        reference={art.reference}
        designation={art.designation}
        prix={art.prix}
        />


      )}
      
    </div>
    <Pagination handlePrevPage={handlePrevPage}
      handleNextPage={handleNextPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
      currentPage ={currentPage }
      />
      </>
  )
}

export default Listarticlescard
