import React, { Fragment } from 'react'
import Carousel from '../../components/Carousel/Carousel'
import Categories from '../../components/Categories/Categories'
import Featured from '../../components/Featured/Featured'
import Offer from '../../components/Offer/Offer'
import Product from '../../components/Product/Product'


export default function HomePage() {
    return (
        <Fragment>
            {/* <Carousel /> */}
            <Featured />
            <Categories />
            <Product productType={0} sectionName = "Sản phẩm mới về"/>
            <Product productType={1} sectionName = "Sản phẩm bán chạy"/>
            <Offer />
        </Fragment>
    )
}
