import axios from 'axios';
import { useFormik } from 'formik';
import userApi from '~/api/usersApi';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { Navigate, NavLink } from 'react-router-dom'

export default function Register() {
    const dispatch = useDispatch()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        onSubmit: values => {
            const loginValue = async () => {
                const response = await userApi.registerUser(values)
                console.log("response", response);
                // await axios({
                //     method: 'post',
                //     url: "http://localhost:8080/users",
                //     headers: {
                //         "content-type": "application/json",
                //       },
                //     data: values
                // }).then((values) => {
                //     dispatch({
                //         type: "LOGIN",
                //         values: values.data
                //     })
                //     Navigate('/')
                // }).catch((err) => {
                //     console.log(err);
                // })
            }
            console.log("values", values);
            loginValue()
        }
    })
    return (
        <div className='bg-gradient-primary'>
            <div className="container">
                <div className="card o-hidden border-0 shadow-lg my-5">
                    <div className="card-body p-0">
                        <div className="row">
                            <div className="col">
                                <div className="p-5">
                                    <div className="text-center">
                                        <h1 className="h4 text-gray-900 mb-4">Tạo tài khoản!</h1>
                                    </div>
                                    <form className="user" onSubmit={(e) => {
                                        e.preventDefault()
                                                formik.handleSubmit(e)
                                            }}>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input type="text" className="form-control form-control-user" id="username" name="username" placeholder="Họ và tên"   onChange={formik.handleChange}/>
                                            </div>
                                            <div className="col-sm-6">
                                                <input type="number" className="form-control form-control-user" id="cmnd" name="cmnd" placeholder="Số chứng minh nhân dân"   onChange={formik.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                        <div className="col-sm-6 mb-3 mb-sm-0">
                                            <input type="email" className="form-control form-control-user" id="email" name="email" placeholder="Email"  onChange={formik.handleChange} />
                                            </div>

                                            <div className="col-sm-6">
                                                <input type="number" className="form-control form-control-user" id="sdt" name="sdt" placeholder="Số điện thoại"  onChange={formik.handleChange}/>
                                            </div>
                                        </div>
                                        
                                        <div className="form-group">
                                            <input type="text" className="form-control form-control-user" id="address" name="address" placeholder="Địa chỉ"  onChange={formik.handleChange} />
                                            
                                        </div>
                                        <div className="form-group row">
                                            <div className="col-sm-6 mb-3 mb-sm-0">
                                                <input type="password" className="form-control form-control-user" id="password" name="password" placeholder="Mật khẩu"  onChange={formik.handleChange}/>
                                            </div>
                                            <div className="col-sm-6">
                                                <input type="password" className="form-control form-control-user" id="repeatPassword" name="repeatPassword" placeholder="Nhập lại Mật khẩu" />
                                            </div>
                                        </div>
                                        <button className="btn btn-primary btn-user btn-block" type='submit'>
                                            Đăng kí tài khoản
                                        </button>
                                        <hr />
                                        {/* <a href="index.html" className="btn btn-google btn-user btn-block">
                                            <i className="fab fa-google fa-fw" /> Register with Google
                                        </a>
                                        <a href="index.html" className="btn btn-facebook btn-user btn-block">
                                            <i className="fab fa-facebook-f fa-fw" /> Register with Facebook
                                        </a> */}
                                    </form>
                                    <hr />
                                    <div className="text-center">
                                        <a className="small" href="#">Quên mật khẩu?</a>
                                    </div>
                                    <div className="text-center">
                                        <NavLink className="small" to='/login'>Bạn đã có tài khoản? Đăng nhập ngay! </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
