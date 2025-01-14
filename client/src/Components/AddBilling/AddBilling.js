
import React, { useState,useEffect } from "react";
import "../AddBilling/AddBilling.css";
import Table from "react-bootstrap/esm/Table";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Checkbox from "@mui/material/Checkbox";
import { Link, useParams } from "react-router-dom";
import BarcodeReader from 'react-barcode-reader';
import axios from "axios";

const AddBilling = () => {
  const [scannedProducts, setScannedProducts] = useState([]); 
  const { bill_number } = useParams();
  
  const exportPDF = async () => {
    const input = document.getElementById("page-to-pdf");
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("billing_details.pdf");
  };

  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  
  const handleScan = async (product_number) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/getSerial/${bill_number}/${product_number}`);
      if (response.status === 200) {
        setScannedProducts(prevProducts => [...prevProducts, response.data.product]);  
      } else {
        console.error('Failed to fetch product');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };


  return (
    <>
    <div className="nav-color"> 
    <div className="position">
          <Link to="/navbar">
            <b style={{ cursor: "pointer", color: "white" }}> Products </b>
          </Link>
          <Link to="/billing">
            <b style={{ cursor: "pointer", color: "white" }}> Billing </b>
          </Link>
        </div></div>
        <div className="back-tab">
        <div id="page-to-pdf">
          <h2> Bill Details</h2>
          <BarcodeReader onScan={handleScan} />

        <Table striped bordered hover className="add-tab">
              <thead>
                <tr>
                  <th> S.No </th>
                  <th><Checkbox {...label} style={{ color: "white" }} checked /> Product.No </th>
                  <th><Checkbox {...label} style={{ color: "white" }} />Before weight</th>
                  <th><Checkbox {...label} style={{ color: "white" }} />After weight</th>
                  <th><Checkbox {...label} style={{ color: "white" }} />Difference</th>
                  <th><Checkbox {...label} style={{ color: "white" }} />Adjustment</th>
                  <th><Checkbox {...label} style={{ color: "white" }} />Final weight</th>
                </tr>
              </thead>
              <tbody>
                {scannedProducts.length > 0 ? (
                  scannedProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.product_number}</td>
                      <td>{product.before_weight}</td>
                      <td>{product.after_weight}</td>
                      <td>{product.difference}</td>
                      <td>{product.adjustment}</td>
                      <td>{product.final_weight}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No product scanned</td>
                  </tr>
                )}
              </tbody>
            </Table>
            </div>
            <button className="pdf" onClick={exportPDF}>
            Export as PDF
          </button>
          
            </div>

    </>
  );
};

export default AddBilling;




// import React, { useState,useEffect } from "react";
// import "../AddBilling/AddBilling.css";
// import Table from "react-bootstrap/esm/Table";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import Checkbox from "@mui/material/Checkbox";
// import { Link, useParams } from "react-router-dom";
// import BarcodeReader from 'react-barcode-reader';
// import axios from "axios";

// const AddBilling = () => {
//   const [scannedProducts, setScannedProducts] = useState([]); 
//   const { bill_number } = useParams();
  
//   const exportPDF = async () => {
//     const input = document.getElementById("page-to-pdf");
//     const canvas = await html2canvas(input);
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF();
//     const imgWidth = 190;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//     pdf.save("billing_details.pdf");
//   };

//   const label = { inputProps: { "aria-label": "Checkbox demo" } };

//   const handleScan = async (product_number) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/products/getSerial/${bill_number}/${product_number}`);
//       if (response.status === 200) {
//         setScannedProducts(prevProducts => [...prevProducts, response.data.product]);  
//       } else {
//         console.error('Failed to fetch product');
//       }
//     } catch (error) {
//       console.error('Error fetching product:', error);
//     }
//   };



//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get('http://localhost:5000/api/products/getAll');
//         setScannedProducts(response.data);
//       } catch (error) {
//         console.error('Failed to fetch products:', error);
//       }
//     };
//     fetchProducts();
//   }, []);

//   return (
//     <>
//       <div className="nav-color">
//         <div className="position">
//           <Link to="/navbar">
//             <b style={{ cursor: "pointer", color: "white" }}> Products </b>
//           </Link>
//           <Link to="/billing">
//             <b style={{ cursor: "pointer", color: "white" }}> Billing </b>
//           </Link>
//         </div>
//         <div className="back-tab">
//           <BarcodeReader onScan={handleScan} />
//           <div id="page-to-pdf">
//             <h2 className="bills"> Bill Details </h2>
//             <Table striped bordered hover className="add-tab">
//               <thead>
//                 <tr>
//                   <th> S.No </th>
//                   <th><Checkbox {...label} style={{ color: "white" }} /> Product.No </th>
//                   <th><Checkbox {...label} style={{ color: "white" }} />Before weight</th>
//                   <th><Checkbox {...label} style={{ color: "white" }} />After weight</th>
//                   <th><Checkbox {...label} style={{ color: "white" }} />Difference</th>
//                   <th><Checkbox {...label} style={{ color: "white" }} />Adjustment</th>
//                   <th><Checkbox {...label} style={{ color: "white" }} />Final weight</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {scannedProducts.length > 0 ? (
//                   scannedProducts.map((product, index) => (
//                     <tr key={index}>
//                       <td>{index + 1}</td>
//                       <td>{product.product_number}</td>
//                       <td>{product.before_weight}</td>
//                       <td>{product.after_weight}</td>
//                       <td>{product.difference}</td>
//                       <td>{product.adjustment}</td>
//                       <td>{product.final_weight}</td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7">No product scanned</td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>
//           <br />
//           <button className="pdf" onClick={exportPDF}>
//             Export as PDF
//           </button>
//         </div>
//       </div>
      
//     </>
//   );
// };

// export default AddBilling;   