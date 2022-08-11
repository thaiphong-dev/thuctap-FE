import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DOMAIN } from '~/util/setting/config'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProductsApi from '~/api/productsApi'

export default function Product(props) {
    const { hotProduct, newProduct } = useSelector(state => state.ProductReducer)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [hotproduct, setHotproduct] = useState([])
    const [newproduct, setNewproduct] = useState([])
    const handerNavigate = (item) => {
        return navigate(`/product/${item}`)
    }
    const addCart = (item) => {
        dispatch({
            type: "ADD_CART",
            item: { ...item, number: 1, size: 1, sizeName: "S" }
        })
    }
    const getProduct = async () => {
        if( props.productType === 1) {
            const response = await ProductsApi.getHotProduct()
            // console.log("response", response);
            setHotproduct(response.data)
            // .then((data) => {
            //     console.log("data");
            //     dispatch({
            //         type: "GET_HOT_PRODUCT",
            //         product: data.data
            //     })
            // }).catch((err) => {
            //     console.log("err")
            // })
        }
        else {
            const response = await ProductsApi.getNewProduct()
            // console.log("ádsadas", response);
            console.log("re",response);
            setNewproduct(response.data)
        // .then((data) => {
        //     dispatch({
        //         type: "GET_NEW_PRODUCT",
        //         product: data.data
        //     })
        // }).catch((err) => {
        //     console.log("err")
        // })
        }
        
    }
    useEffect(() => {
        window.scrollTo(0, 0)
        getProduct()

    }, [])
    
    return (
        <div className="container-fluid pt-5 pb-3">
            <h2 className="section-title position-relative text-uppercase mx-xl-5 mb-4"><span className="bg-secondary pr-3">{props.sectionName}</span></h2>
            <div className="row px-xl-5">
                {(hotproduct.length > 0 ? hotproduct : newproduct)?.map((item, index) => {
                    if(index < 8)
                    return (
                        <div className="col-lg-3 col-md-4 col-sm-6 pb-1" key={index}>
                            <div className="product-item bg-light mb-4">
                                <div className="product-img position-relative overflow-hidden">
                                    <img className="img-fluid w-100" src={item.hinhAnh} alt='true' />
                                    <div className="product-action">
                                        <a onClick={() => { addCart(item) }} className="btn btn-outline-dark btn-square"><i className="fa fa-shopping-cart" /></a>
                                        <a className="btn btn-outline-dark btn-square"><i className="far fa-heart" /></a>
                                        <a className="btn btn-outline-dark btn-square"><i className="fa fa-sync-alt" /></a>
                                        <a onClick={() => { navigate(`/product/${item.id}`) }} className="btn btn-outline-dark btn-square" href='#'><i className="fa fa-search" /></a>
                                    </div>
                                </div>
                                <div className="text-center py-4">
                                    <a onClick={() => { handerNavigate(item.id) }} className="h6 text-decoration-none text-truncate" href='#'>{item.tenSP}...</a>
                                    <div className="d-flex align-items-center justify-content-center mt-2">
                                        <h5>{item?.gia - item?.gia*0.2}</h5><h6 className="text-muted ml-2"><del>{item?.gia}</del></h6>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center mb-1">
                                        <small className="fa fa-star text-primary mr-1" />
                                        <small className="fa fa-star text-primary mr-1" />
                                        <small className="fa fa-star text-primary mr-1" />
                                        <small className="fa fa-star text-primary mr-1" />
                                        <small className="fa fa-star text-primary mr-1" />
                                        <small>(99)</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

    )
}
