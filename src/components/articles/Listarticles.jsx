import React, { useEffect, useState } from 'react'
import {fetcharticlesPagination,deletearticle} from "../../services/articleservice"

import "./article.css"
import Affichearticle from './Affichearticle';
import Pagination from './Pagination';

import Headerarticle from './Headerarticle';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import Insertarticle from './Insertarticle';

import Editarticle from './Editarticle';

const Listarticles = () => {

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [articles, setArticles] = useState([]);
  const [limit, setLimit]=useState(5)
  const [searchText, setSearchText] = useState('');
  const [show, setShow] = useState(false);

  const [article, setArticle] = useState(null);
  const [showModalEdit, setShowModalEdit] = useState(false);
 

  const handleClose = () => {setShow(false); setShowModalEdit(false)}
  const handleShow = () => setShow(true);
 

  const fetchProducts = async (page,limit,searchText) => {
    try {
      const res = await fetcharticlesPagination(page,limit,searchText)
     
      setArticles(res.data.products);
      setTotalPages(res.data.totalPages);
   
    } catch (error) {
      console.log(error);
    }
  };
 useEffect(() => {
   
    fetchProducts(currentPage,limit,searchText);
  }, [currentPage,limit,searchText]);

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

  const handleLimitChange = (event) => {
    setLimit(parseInt(event.target.value, 10));
    setCurrentPage(1);  
  };
  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(1);  
  };

  const handleDeletearticle = async (id,ref) => {
    
      confirmAlert({
        title: "Confirm delete...",
        message: " supprimer l' article: " + ref,
        buttons: [
        {
        label: 'Oui',
        onClick: () => deletearticle(id)
        .then(res=>fetchProducts(currentPage,limit,''))
        
        .catch(error=>console.log(error))
        },
        {
        label: 'Non',
        }
        ]
        });
 
      }

      const handleEditarticle = (item) => {
        setArticle(item);
        setShowModalEdit(true);
        
    };

  return (
    <div>
      <div className="table-container-header">
  <button className="new" onClick={handleShow}>
    
      <i className="fa-solid fa-plus-square"></i> Nouveau
    
  </button>
      <Headerarticle searchText={searchText}
      handleSearchChange={handleSearchChange}/>
      <Affichearticle 
      articles={articles} 
      handleLimitChange={handleLimitChange} 
      limit={limit} handleDeletearticle={handleDeletearticle}
      handleEditarticle={handleEditarticle}
      />
      </div>
      <Pagination handlePrevPage={handlePrevPage}
      handleNextPage={handleNextPage}
      handlePageChange={handlePageChange}
      totalPages={totalPages}
      currentPage ={currentPage }
      />

{show && <Insertarticle
          show={show}
          handleClose={handleClose}
          fetchProducts={fetchProducts}
          limit={limit}
          />  }

{showModalEdit && (
                <Editarticle
                    show={showModalEdit}
                    handleClose={handleClose}
                    fetchProducts={fetchProducts}
                    art={article}
                    limit={limit}
                />
            )}

    </div>
 
  )
}

export default Listarticles
