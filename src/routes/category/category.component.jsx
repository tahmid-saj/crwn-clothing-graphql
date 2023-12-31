import { useContext, useState, useEffect, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from "@apollo/client";

import ProductCard from '../../components/product-card/product-card.component';
import Spinner from '../../components/spinner/spinner.component';

import { CategoriesContext } from '../../contexts/categories.context';

import { CategoryContainer, Title } from './category.styles';

const GET_CATEGORY = gql`
  getCollectionsByTitle(title: $title) {
    id
    title
    items {
      id
      name
      price
      imageUrl
    }
  }
`

const SET_CATEGORY = gql`
  mutation ($category: Category!) {
    addcategory(category: $category) {
      id
      title
      items {
        id
        name
        price
        imageUrl
    }
    }
  }
`

const [ addcategory, { loading, error, data } ] = useMutation(SET_CATEGORY);

addcategory({ variables: { category: categoryObject } });

const Category = () => {
  const { category } = useParams();
  // const { categoriesMap, loading } = useContext(CategoriesContext);

  const { loading, error, data } = useQuery(GET_CATEGORY, {
    variables: {
      title: category
    }
  });

  useEffect(() => {
    if (data) {
      const {
        getCollectionsByTitle: { items }
      } = data;

      setProducts(items);
    }
  }, [category, data]);

  const [products, setProducts] = useState(categoriesMap[category]);

  useEffect(() => {
    setProducts(categoriesMap[category]);
  }, [category, categoriesMap]);

  return (
    <Fragment>
      {
        loading ? <Spinner/> : (
          <Fragment>
          <Title>{category.toUpperCase()}</Title>
          <CategoryContainer>
            {products &&
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </CategoryContainer>
          </Fragment>
        )
      }
    </Fragment>
  );
};

export default Category;
