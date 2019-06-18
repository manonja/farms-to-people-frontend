import React, { Component } from 'react';

import ProductCollection from '../customerComponents/ProductCollection';
import CategoriesBar from '../components/CategoriesBar';

class CustomerContainer extends Component {

    render() {  
        return ( 
           <div>
                <CategoriesBar
                    productCategories={this.props.productCategories} 
                    allProducts={this.props.allProducts}
                    handleFilterCategory={this.props.handleFilterCategory}
                    handleAllCategories={this.props.handleAllCategories}
                />
                <h3 id='customer-title' className="d-flex justify-content-center">Shop fresh produces </h3>
                <ProductCollection 
                    allProducts={this.props.allProducts}
                    addToBasket={this.props.addToBasket}
                    customerBasket={this.props.customerBasket}
                    basket_id={this.props.basket_id}
                    filterProducts={this.props.filterProducts}
                    filterCategory={this.props.filterCategory}
                />
           </div>
         );
    }
}
 
export default CustomerContainer;