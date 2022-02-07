import ProductProps from "./ProductProps";

type CreatePurchaseFormProps = {
  products: ProductProps[]
  fetchProducts: ()=>void
  closeModal: ()=> void
};

export default CreatePurchaseFormProps;
