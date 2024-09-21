import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const SearchSchema = Yup.object().shape({
  query: Yup.string().required("Search query is required"),
});

const SearchApplication = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredTodos, setFilteredTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/todos"
        );
        setTodos(response.data);
        setFilteredTodos(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const handleSearch = (query) => {
    const lowerCaseQuery = query.toLowerCase().trim();

    const filtered = todos.filter((todo) => {
      return (
        todo.title.toLowerCase().includes(lowerCaseQuery) || 
        todo.userId.toString() === lowerCaseQuery ||
        todo.id.toString() === lowerCaseQuery 
      );
    });

    setFilteredTodos(filtered);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-5">
      <h1 className="text-4xl font-extrabold text-green-700 mb-8">Todo Search</h1>

      <Formik
        initialValues={{ query: "" }}
        validationSchema={SearchSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSearch(values.query);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md flex items-center">
            <div className="flex-grow">
              <Field
                type="text"
                name="query"
                placeholder="Search Todos"
                className="w-full p-2 border-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <ErrorMessage
                name="query"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="ml-3 px-4 py-2 border-2 rounded-md bg-green-500 text-white hover:bg-green-700 transition"
            >
              Search
            </button>
          </Form>
        )}
      </Formik>

      {loading && <p className="mt-5">Loading...</p>}
      {error && <p className="mt-5 text-red-500">{error}</p>}

      {filteredTodos.length === 0 ? (
        <p className="mt-5">No results found.</p>
      ) : (
        <ul className="w-full max-w-md mt-5 space-y-3">
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className="p-4 bg-white rounded-md shadow-md flex justify-between items-center"
            >
              <span>{todo.title}</span>
              <span className="text-gray-500">
                User ID: {todo.userId}, Todo ID: {todo.id}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchApplication;
