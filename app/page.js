"use client";

import Image from "next/image";
import Header from "./components/header";
import { useState, useEffect } from "react";
import { FaPen } from "react-icons/fa";

export default function Home() {
  const [productForm, setProductForm] = useState({});
  const [updateProductForm, setUpdateProductForm] = useState({});
  const [products, setProducts] = useState([]);
  const [alert, setAlert] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [dropdown, setDropdown] = useState([]);
  const [popup, setPopup] = useState(false);
  const [editId, updateEditId] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch("/api/product");
      let rjson = await response.json();
      setProducts(rjson.products);
    };
    fetchProduct();
  }, []);

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productForm),
      });

      if (response.ok) {
        console.log("Product added successfully!");
        setAlert("Your product has been added successfully");
        setProductForm({});
        // You can add additional logic or state updates here
      } else {
        console.error("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
    const response = await fetch("/api/product");
    let rjson = await response.json();
    setProducts(rjson.products);
  };

  const handleChange = (e) => {
    setProductForm({ ...productForm, [e.target.name]: e.target.value });
  };

  const handleUpdateChange = (e) => {
    setUpdateProductForm({
      ...updateProductForm,
      [e.target.name]: e.target.value,
    });
  };

  const clicked = (slug) => {
    setPopup(true);
    updateEditId(slug);
  };

  const updateProduct = async () => {
    let index = products.findIndex((item) => item.slug == editId);

    console.log(index);

    let newProducts = JSON.parse(JSON.stringify(products));

    newProducts[index].slug = updateProductForm?.slug;
    newProducts[index].quantity = updateProductForm?.updateQuantity;
    newProducts[index].price = updateProductForm?.updatePrice;
    

    console.log(products);

    let newSlug = updateProductForm?.slug;
    let newQuantity = updateProductForm?.updateQuantity;
    let newPrice = updateProductForm?.updatePrice;

    console.log(updateProductForm);

    setProducts(newProducts);

    setLoadingAction(true);
    const response = await fetch("/api/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ editId, newSlug, newQuantity, newPrice }),
    });
    setLoadingAction(false);
    setPopup(false);
  };

  const onDropDownEdit = async (e) => {
    let value = e.target.value;
    setQuery(value);
    if (value.length > 1) {
      setLoading(true);
      setDropdown([]);
      const response = await fetch("/api/search?query=" + query);
      let rjson = await response.json();
      setDropdown(rjson.products);
    } else {
      setDropdown([]);
    }
    setLoading(false);
  };

  const buttonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug);
    let indexDrop = dropdown.findIndex((item) => item.slug == slug);

    let newProducts = JSON.parse(JSON.stringify(products));
    let newDropdown = JSON.parse(JSON.stringify(dropdown));

    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
      newDropdown[indexDrop].quantity = parseInt(initialQuantity) - 1;
    }

    setProducts(newProducts);
    setDropdown(newDropdown);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    setLoadingAction(false);
  };

  const displayButtonAction = async (action, slug, initialQuantity) => {
    let index = products.findIndex((item) => item.slug == slug);

    let newProducts = JSON.parse(JSON.stringify(products));

    if (action == "plus") {
      newProducts[index].quantity = parseInt(initialQuantity) + 1;
    } else {
      newProducts[index].quantity = parseInt(initialQuantity) - 1;
    }

    setProducts(newProducts);

    setLoadingAction(true);
    const response = await fetch("/api/action", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ action, slug, initialQuantity }),
    });
    let r = response.json();
    setLoadingAction(false);
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert("");
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [alert]);

  return (
    <>
      <Header />

      {/* Display current Stock */}
      <div className="container mx-auto bg-red-50">
        <h1 className="text-3xl font-bold mb-4 mx-20">Search a Product</h1>

        {/* Search Product Form */}
        <form className="my-4 w-full max-w-md mx-auto">
          {/* Search Input Field */}
          <div className="flex items-center border-b border-blue-500 py-2">
            <input
              type="text"
              placeholder="Enter product name"
              className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
              onChange={onDropDownEdit}
              // Add your onChange and value handlers as needed
            />
            <button
              type="button"
              className="flex-shrink-0 bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700"
            >
              Search
            </button>
          </div>

          {/* Dropdown (replace this with your actual dropdown implementation) */}
          <div className="mt-4">
            {/* Your dropdown code goes here */}
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              // Add your onChange and value handlers as needed
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              {/* Add more categories as needed */}
            </select>
          </div>
          <div className="flex justify-center">
            {loading && (
              <svg
                width="50px"
                height="50px"
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
                xmlns="http://www.w3.org/2000/svg"
                fill="black"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke-width="10"
                  stroke="#000"
                  stroke-dasharray="47.12388980384689 47.12388980384689"
                  fill="none"
                  stroke-linecap="round"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    repeatCount="indefinite"
                    dur="1s"
                    keyTimes="0;1"
                    values="0 50 50;360 50 50"
                  ></animateTransform>
                </circle>
              </svg>
            )}
          </div>

          <div className="w-[30vw] bg-purple-100 rounded-md mx-auto">
            <div className="container">
              {dropdown.length > 0 && (
                <div className="flex justify-between py-2 border-b-2 font-bold items-center">
                  <span className="w-1/3 text-center">Product</span>
                  <span className="w-1/3 text-center">Quantity</span>
                  <span className="w-1/3 text-center">Price</span>
                </div>
              )}

              {dropdown.map((item) => (
                <div
                  className="flex justify-between py-2 border-b-2"
                  key={item.id}
                >
                  <span className="w-1/3 text-center">{item.slug}</span>
                  <div className="w-1/3 flex justify-between">
                    <button
                      onClick={() => {
                        buttonAction("minus", item.slug, item.quantity);
                      }}
                      disabled={loadingAction}
                      className="mr-2 cursor-pointer disabled:opacity-50"
                    >
                      ➖
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => {
                        buttonAction("plus", item.slug, item.quantity);
                      }}
                      disabled={loadingAction}
                      className="ml-2 cursor-pointer disabled:opacity-50"
                    >
                      ➕
                    </button>
                  </div>
                  <span className="w-1/3 text-center">{item.price}</span>
                </div>
              ))}

              {dropdown.length === 0 && (
                <div className="text-center py-2 text-gray-500">
                  No products found
                </div>
              )}
            </div>
          </div>
        </form>
        {/* Add a Product Heading */}

        <div className="text-green-800 text-center">{alert}</div>
        <h1 className="text-3xl font-bold mb-4 mx-20">Add a Product</h1>

        {/* Add Product Form */}
        <form className="my-4 flex flex-col justify-between items-center">
          {/* Product Name Field */}
          <label className="flex flex-col mb-2" htmlFor="productName">
            Product Name:
            <input
              type="text"
              id="productName"
              name="slug"
              className="border p-2"
              value={productForm?.slug || ""}
              onChange={handleChange}
            />
          </label>

          {/* Quantity Field */}
          <label className="flex flex-col mb-2" htmlFor="quantity">
            Quantity:
            <input
              type="number"
              id="quantity"
              name="quantity"
              className="border p-2"
              value={productForm?.quantity || ""}
              onChange={handleChange}
            />
          </label>

          {/* Price Field */}
          <label className="flex flex-col mb-2" htmlFor="price">
            Price:
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"
              className="border p-2"
              value={productForm?.price || ""}
              onChange={handleChange}
            />
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={addProduct}
          >
            Add Product
          </button>
        </form>

        {/* Display Current Stock */}
        <div>
          {/* Display Current Stock Heading */}
          <h1 className="text-3xl font-bold mb-4 mx-20">Display Current Stock</h1>

          {/* Stock Table */}
          <table className="table-auto w-[90%] mx-auto">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Price</th>
              </tr>
            </thead>
            <tbody>
  {products.map((item) => (
    <tr key={item.id}>
      {/* Product Name */}
      <td className="border px-4 py-2 items-center">
        <div className="mr-5 inline-block w-4/5">{item.slug}</div>
        <button
          onClick={() => clicked(item.slug)}
          className="cusrsor-pointer disabled:opacity-50"
        >
          <FaPen />
        </button>
      </td>
      
      {/* Quantity */}
      <td className="border px-4 py-2 flex justify-around">
        <button
          onClick={() => {
            displayButtonAction("minus", item.slug, item.quantity);
          }}
          disabled={loadingAction}
          className="mr-2 cursor-pointer disabled:opacity-50"
        >
          ➖
        </button>
        <span className="mr-2">{item.quantity}</span>
        <button
          onClick={() => {
            displayButtonAction("plus", item.slug, item.quantity);
          }}
          disabled={loadingAction}
          className="cursor-pointer disabled:opacity-50"
        >
          ➕
        </button>
      </td>
      
      {/* Price */}
      <td className="border px-4 py-2 text-center">₹{item.price}</td>
    </tr>
  ))}
</tbody>

          </table>
        </div>

        {popup && (
          <div className="border-2 border-gray-800 p-4 w-64 text-center mx-auto bg-gray-100 shadow-md">
            <div className="block mb-2 text-xl font-bold">Relpace With</div>

            <label
              className="block mb-2 text-md font-semibold"
              htmlFor="updateProductName"
            >
              Product Name:
              <input
                type="text"
                id="updateproductName"
                name="slug"
                className="border p-2 w-full"
                value={updateProductForm?.slug}
                onChange={handleUpdateChange}
              />
            </label>

            {/* Quantity Field */}
            <label
              className="block mb-2 text-md font-semibold"
              htmlFor="updateQuantity"
            >
              Quantity:
              <input
                type="number"
                id="updateQuantity"
                name="updateQuantity"
                className="border p-2 w-full"
                value={updateProductForm?.quantity}
                onChange={handleUpdateChange}
              />
            </label>

            {/* Price Field */}
            <label
              className="block mb-2 text-md font-semibold"
              htmlFor="updatePrice"
            >
              Price:
              <input
                type="number"
                id="updatePrice"
                name="updatePrice"
                step="0.01"
                className="border p-2 w-full"
                value={updateProductForm?.price}
                onChange={handleUpdateChange}
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={updateProduct}
            >
              Update Product
            </button>
          </div>
        )}
      </div>
    </>
  );
}
