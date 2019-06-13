import React, {Component} from 'react'
import './App.css';

import { Route, Switch, withRouter } from 'react-router-dom'

import API from './data/API'

import Header from './containers/Header'
import HomePage from './containers/HomePage';
import Signin from './containers/Signin'
import Signup from './containers/Signup'
import CustomerContainer from './containers/CustomerContainer';
import FarmerContainer from './containers/FarmerContainer';


class App extends Component {
  
  state = {
    email: '',
    user_type: '', 
    current_user: '', 
    filterCategory: '',
    allProducts: [],
    farmerProducts: [],
    customerBasket: [], 
    productCategories: [],
    farm: '', 
    current_basket: null
  }

  signin = (email, current_user, token) => {
    localStorage.setItem('token', token)
    this.setState({email, current_user}, async () => {
      await this.defUserType()
   
      if (this.state.user_type === 'customer') {
        this.props.history.push('/products')
      } else if ((this.state.user_type === 'farmer')) {
        this.props.history.push('/farmers')
      } else if (this.state.user_type === 'customer'){
        this.props.history.push('/products')
      } else {
        this.props.history.push('/')
      }
    })  
  }
  
  signup = (email, user_type) => {
      this.setState({email, user_type})
    }

  signout = () => {
      this.setState({email: '', current_user: ''})
      localStorage.removeItem('token')
      this.props.history.push('/')
  }
   // def user type 
  defUserType = () => {
    if (this.state.current_user.farmer_id){
      return this.setState({user_type: 'farmer'})
    } else if (this.state.current_user.customer_id){
      return this.setState({user_type: 'customer'})
    } else {
      return this.setState({user_type: ''})
    }
  }

  getAllProducts = async () => {
    API.getProducts()
        .then(allProducts => this.setState({allProducts}))
  }

  // distinct = (value, index, self) => {
  //   return self.indexOf(value) === index
  // }

  getProductCategories = async () => {
    API.getCategories()
      .then(productCategories => this.setState({productCategories}))
  }

  // farmer functionalities
  getFarmerData = async () => {
    const id = this.state.current_user.farmer_id
    return fetch(`http://localhost:3001/farmers/${id}`)
        .then(resp => resp.json())
        .then(data => this.setState({farmerProducts: data.products, farm: data.farm}))
  }

  addToFarmerProducts = (newProduct) => {
    this.setState({farmerProducts: [...this.state.farmerProducts, newProduct]})
  }

  removeProduct = (id) => {
    API.removeProductFromSale(id)
      .then(this.removeFromSale(id))
  }
  
  removeFromSale = (id) => {
    this.setState({farmerProducts: [...this.state.farmerProducts.filter(p => p.id !== id)]})
  }

  // customer functionalities
  getCustomerData = async () => {
    // get customer basket 
    const id = this.state.current_user.customer_id
    // basket = data.basket.products
    return fetch(`http://localhost:3001/customers/${id}`)
      .then(resp => resp.json())
      .then(data => {
        if (data.basket){
          this.setState({customerBasket: data.basket.products, current_basket: data.basket.id})
        } else {
          this.setState({customerBasket: [], current_basket: data.id})
        }
      })
  }

  addToBasket = (product) => {
    this.setState({customerBasket: [...this.state.customerBasket, product]})
  }
  
  deleteProduct = (id, basket_id) => {
    API.removeProductFromBasket(id, basket_id)
      .then(this.removeFromBasket(id))
  }

  removeFromBasket = (id) => {
    this.setState({customerBasket: [...this.state.customerBasket.filter(p => p.id !== id)]})
  }

  handleFilterCategory = (category) => {
    this.setState({filterCategory: category})
  }

  handleAllCategories = () => {
    this.setState({filterCategory: ''})
  }

  filterProducts = (category) => {
    const products = this.state.allProducts
    const filteredProducts = products.filter(product => product.category.name === category)
    return filteredProducts
  }


  componentDidMount() {
        API.validate()
          .then(data => {
              if(data.error){
                  this.props.history.push('/')
              }
              else {
                  this.signin(data.email, data.user, localStorage.getItem('token')) 
                  if (this.state.user_type === 'farmer'){
                    this.getFarmerData()
                  } else if (this.state.user_type === 'customer') {
                    this.getCustomerData()
                    this.getAllProducts()
                    this.getProductCategories()

                  }
              }
          })
    }

  render() { 
    const {signin, signup, signout, addToFarmerProducts, removeProduct, addToBasket, deleteProduct, filterProducts, handleFilterCategory, handleAllCategories } = this
    const {email, current_user, user_type, farmerProducts, customerBasket, allProducts, current_basket, productCategories, filterCategory} = this.state
    return ( 
      <div className="app-container">
        <Header current_user={current_user} user_type={user_type} signout={signout} />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route exact path='/signin' component={props => <Signin {...props} signin={signin}/>} />
          <Route exact path='/signup' component={props => <Signup {...props} signup={signup}/>} />
          <Route 
            exact path='/products' 
            component={props => <CustomerContainer {...props} 
            customerBasket={customerBasket}
            addToBasket={addToBasket} 
            deleteProduct={deleteProduct}
            email={email} 
            current_user={current_user}
            current_basket={current_basket}
            allProducts={allProducts} 
            productCategories={productCategories}
            handleFilterCategory={handleFilterCategory}
            handleAllCategories={handleAllCategories}
            filterProducts={filterProducts}
            filterCategory={filterCategory}
            signout={signout}/>}
          />
          <Route 
            exact path='/farmers' 
            component={props => <FarmerContainer {...props} 
            farmerProducts={farmerProducts} 
            addToFarmerProducts={addToFarmerProducts} 
            removeProduct={removeProduct}
            email={email} 
            current_user={current_user} 
            signout={signout}/>}
          />
          <Route component={() => <h1>Page not found.</h1>} />
        </Switch>     
    </div>
     );
  }
}


export default withRouter(App)
