import React, {Component} from 'react';

import API from '../data/API'

class ProductCard extends Component {

    state = {
        basket_id: this.props.current_basket
    }

    handleChange = e => {
        e.preventDefault()
        this.setState({ product_id: e.target.value})
    }

    handleSubmit = (id, product) => {
        const {basket_id} = this.state
        
        let productForApi = {
            product_id: id,
            basket_id
        }

        API.addToCustomerBasket(productForApi)
        this.props.addToBasket(product);    
    }


    render() {
        const {url_img, name, price, quantity, id} = this.props.product
        console.log(this.props.product)
        return (

            <div id='productCard' className="card card-cascade narrower">
                <div className="view view-cascade overlay">
                    <img className="img card-img-top" src={url_img} alt={name}/>
                    <a><div className="mask rgba-white-slight"></div></a>
                </div>
                <div className="card-body card-body-cascade">
                    <h5 className="pink-text pb-2 pt-1"><i className="fas fa-utensils"></i> Category</h5>
                    <h4  className="font-weight-bold card-title">{name}</h4>
                    <p className="card-text">£{price}</p>
                    <p className="card-text">{quantity}</p>
                    <button onClick={() => this.handleSubmit(id, this.props.product)} className="btn btn-unique" >ADD TO BASKET</button>
                </div>
                <div className="card-footer text-muted text-center">Chalk Farm</div>
            </div>
        )
    }
}

export default ProductCard