
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch } from "react-redux";
import axiosInstance from "../../services/axiosInstance";
import Sidebar from "../../components/Sidebar";
import {
  addCategory,
  addSubcategory,
  deleteCategory,
  deleteSubcategory,
  editCategory,
  editSubcategory,
} from "../../features/admin/adminslice";

// Set the app element for the modal
Modal.setAppElement("#root");

// Validation schema for Category form using Yup
const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Category Name is required"),
  description: Yup.string().optional(),
});

// Validation schema for Subcategory form
const SubcategorySchema = Yup.object().shape({
  name: Yup.string().required("Subcategory Name is required"),
  categoryId: Yup.string().required("Please select a category"),
});

function Category() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [subcategoryModalIsOpen, setSubcategoryModalIsOpen] = useState(false); // Subcategory modal state
  const [categories, setCategories] = useState([]); // Store categories
  const [subcategories, setSubcategories] = useState([]); // Store subcategories
  const [isSubmitting, setIsSubmitting] = useState(false); // Submission state
  const [currentCategory, setCurrentCategory] = useState(null); // For editing category
  const [confirmationModalIsOpen, setConfirmationModalIsOpen] = useState(false); // State for confirmation modal
  const [categoryToDelete, setCategoryToDelete] = useState(null); // For deletion
  const [editSubcategoryModalIsOpen, setEditSubcategoryModalIsOpen] = useState(false); // Edit subcategory modal state
  const [subcategoryConfirmationModalIsOpen, setSubcategoryConfirmationModalIsOpen] = useState(false); // Subcategory delete confirmation modal
  const [currentSubcategory, setCurrentSubcategory] = useState(null); // For editing subcategory
  const [subcategoryToDelete, setSubcategoryToDelete] = useState(null); // For subcategory deletion

  const dispatch = useDispatch();

  // Modal open/close functions
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const openEditModal = (category) => {
    setCurrentCategory(category); // Set the current category to edit
    setEditModalIsOpen(true);
  };
  const closeEditModal = () => setEditModalIsOpen(false);


  const openSubcategoryModal = () => setSubcategoryModalIsOpen(true);
  const closeSubcategoryModal = () => setSubcategoryModalIsOpen(false);


  const openEditSubcategoryModal = (subcategory) => {
    setCurrentSubcategory(subcategory); // Set the current subcategory to edit
    setEditSubcategoryModalIsOpen(true);
  };
  const closeEditSubcategoryModal = () => setEditSubcategoryModalIsOpen(false);



  const openConfirmationModal = (category) => {
    setCategoryToDelete(category); // Set the category to delete
    setConfirmationModalIsOpen(true);
  };

  const closeConfirmationModal = () => {
    setCategoryToDelete(null); // Reset the category to delete
    setConfirmationModalIsOpen(false);
  };


  const openSubcategoryConfirmationModal = (subcategory) => {
    setSubcategoryToDelete(subcategory); // Set the subcategory to delete
    setSubcategoryConfirmationModalIsOpen(true);
  };

  const closeSubcategoryConfirmationModal = () => {
    setSubcategoryToDelete(null); // Reset the subcategory to delete
    setSubcategoryConfirmationModalIsOpen(false);
  };




  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchSubCategories = async () => {
    try {
      const response = await axiosInstance.get("/subcategories");
      console.log(response.data, "vooooooooooooooo");
      setSubcategories(response.data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Submit form data for adding
  const handleSubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      await dispatch(addCategory(values));
      await fetchCategories(); // Refresh category list
      closeModal(); // Close modal after adding
      resetForm();
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit form data for editing
  const handleEditSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await dispatch(editCategory({ id: currentCategory._id, ...values }));
      await fetchCategories();
      closeEditModal(); // Close modal after editing
    } catch (error) {
      console.error("Error editing category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit form data for adding a subcategory
  const handleSubcategorySubmit = async (values, { resetForm }) => {
    setIsSubmitting(true);
    try {
      // Dispatch addSubcategory with form values
      await dispatch(addSubcategory(values));
      await fetchCategories(); // Refresh category list after adding the subcategory
      await fetchSubCategories();
      closeSubcategoryModal(); // Close modal after adding subcategory
      resetForm();
    } catch (error) {
      console.error("Error adding subcategory:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  // Submit form data for editing a subcategory
  const handleEditSubcategorySubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await dispatch(editSubcategory({ id: currentSubcategory._id, ...values }));
      await fetchSubCategories();
      closeEditSubcategoryModal(); // Close modal after editing subcategory
    } catch (error) {
      console.error("Error editing subcategory:", error);
    } finally {
      setIsSubmitting(false);
    }
  };




  // Delete category
  const handleDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await dispatch(deleteCategory(categoryToDelete._id));
      await fetchCategories(); // Refresh category list after deletion
      closeConfirmationModal(); // Close confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };


   // Delete subcategory
   const handleDeleteSubcategory = async () => {
    if (!subcategoryToDelete) return;
    try {
      await dispatch(deleteSubcategory(subcategoryToDelete._id));
      await fetchSubCategories(); // Refresh subcategory list after deletion
      closeSubcategoryConfirmationModal(); // Close confirmation modal after deletion
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };



  return (
    <div className="flex min-h-screen bg-gray-100 ml-64">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Categories</h1>
          <div className="flex space-x-4">
            {/* Add Category Button */}
            <button
              onClick={openModal}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Add Category
            </button>
            {/* Add Subcategory Button */}
            <button
              onClick={openSubcategoryModal}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
            >
              Add Subcategory
            </button>
          </div>
        </div>

        <p className="text-lg text-gray-600 mb-10">
          Manage categories and subcategories by adding, editing, or deleting
          them.
        </p>

        {/* Existing categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category._id}
              className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {category.name}
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                {category.description}
              </p>
              <div className="mt-4 flex space-x-4">
                <button
                  onClick={() => openEditModal(category)}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => openConfirmationModal(category)} // Open confirmation modal
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Subcategories Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Subcategories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subcategories.map((subcategory) => (
              <div
                key={subcategory.id}
                className="group relative bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4"
              >
                <h4 className="text-lg font-semibold text-gray-800">
                  {subcategory.name}
                </h4>
                <p className="text-sm text-gray-500 mt-2">
                  Category:{" "}
                  {categories.find((cat) => cat._id === subcategory.categoryId)
                    ?.name || "Unknown"}
                </p>
                <div className="mt-4 flex space-x-4">
                <button
                    onClick={() => openEditSubcategoryModal(subcategory)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button 
                   onClick={() => openSubcategoryConfirmationModal(subcategory)}
                     className="text-red-500 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal for Adding a Category */}
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel="Add Category"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Category</h2>
            <Formik
              initialValues={{ name: "", description: "" }}
              validationSchema={CategorySchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Category Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter category name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Category Description (Optional)
                    </label>
                    <Field
                      as="textarea"
                      name="description"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter category description"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Category"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>

        {/* Modal for Adding a Subcategory */}
        <Modal
          isOpen={subcategoryModalIsOpen}
          onRequestClose={closeSubcategoryModal}
          contentLabel="Add Subcategory"
          className="fixed inset-0 flex items-center justify-center"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add New Subcategory</h2>
            <Formik
              initialValues={{ name: "", categoryId: "" }}
              validationSchema={SubcategorySchema}
              onSubmit={handleSubcategorySubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Subcategory Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter subcategory name"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Category
                    </label>
                    <Field
                      as="select"
                      name="categoryId"
                      className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="categoryId"
                      component="div"
                      className="text-red-500 text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeSubcategoryModal}
                      className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Adding..." : "Add Subcategory"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>







        {/* Modal for Editing a Subcategory */}
        {currentSubcategory && (
          <Modal
            isOpen={editSubcategoryModalIsOpen}
            onRequestClose={closeEditSubcategoryModal}
            contentLabel="Edit Subcategory"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Subcategory</h2>
              <Formik
                initialValues={{
                  name: currentSubcategory.name,
                  categoryId: currentSubcategory.categoryId,
                }}
                validationSchema={SubcategorySchema}
                onSubmit={handleEditSubcategorySubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Subcategory Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter subcategory name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Select Category
                      </label>
                      <Field
                        as="select"
                        name="categoryId"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage
                        name="categoryId"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeEditSubcategoryModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal>
        )}

     {/* Subcategory Confirmation Modal for Deleting a Subcategory */}
     {subcategoryToDelete && (
          <Modal
            isOpen={subcategoryConfirmationModalIsOpen}
            onRequestClose={closeSubcategoryConfirmationModal}
            contentLabel="Confirm Deletion"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-red-600">
                Confirm Deletion
              </h2>
              <p>
                Are you sure you want to delete the subcategory "
                {subcategoryToDelete.name}"?
              </p>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={closeSubcategoryConfirmationModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubcategory}
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}











        {/* Confirmation Modal for Deleting a Category */}
        {categoryToDelete && (
          <Modal
            isOpen={confirmationModalIsOpen}
            onRequestClose={closeConfirmationModal}
            contentLabel="Confirm Deletion"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-red-600">
                Confirm Deletion
              </h2>
              <p>
                Are you sure you want to delete the category "
                {categoryToDelete.name}"?
              </p>
              <div className="flex justify-end mt-6 space-x-4">
                <button
                  onClick={closeConfirmationModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete} // Call handleDelete here to confirm deletion
                  className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Modal for Editing a Category */}
        {currentCategory && (
          <Modal
            isOpen={editModalIsOpen}
            onRequestClose={closeEditModal}
            contentLabel="Edit Category"
            className="fixed inset-0 flex items-center justify-center"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto shadow-lg">
              <h2 className="text-xl font-bold mb-4">Edit Category</h2>
              <Formik
                initialValues={{
                  name: currentCategory.name,
                  description: currentCategory.description,
                }}
                validationSchema={CategorySchema}
                onSubmit={handleEditSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Category Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category name"
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-red-500 text-sm"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block mb-2 text-sm font-medium text-gray-700">
                        Category Description (Optional)
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        className="border p-2 w-full rounded focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter category description"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={closeEditModal}
                        className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg mr-2 transition-all duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-all duration-200"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Category;
