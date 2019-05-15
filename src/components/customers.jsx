import React, { Component } from 'react';
import User_detail_info from "./users/user_detail_info"
import Add_new_user from "./users/add_new_user"

import queryString from "query-string";

import http from "../services/users";

class Customers extends Component {
    state = { 
        new_user_isShow:false,
        
        users:[],
        templateRenders:[
            {type:"input",name:"fullname",range:"",value:""},
            {type:"input",name:"address",range:"",value:""},
            {type:"input",name:"phone",range:"",value:""},
            {type:"input",name:"user",range:"",value:""},
            {type:"input",name:"_id",range:"",value:""}
        ],
        currentUser:""
     }
    async componentDidMount() {
        //init data customer //chi url co userid dung thi ms get dc ve data
        const userId=queryString.parse(this.props.location.search)['user'];
        //update templateRenders
        let templateRenders=this.state.templateRenders.map(element=>{
            if(element.name==="user"){
                element.value=userId;
            }
            return element;
        })
        this.setState({templateRenders});
        this.setState({currentUser:userId});


        http.setEndpoint("http://localhost:5000/api/customers/"+"?user="+userId);
        
        let users=await http.get();
        //them isShow
        users=users.map(u=>{
            u.isShow=false
            return u
        })
        //console.log(users);
        this.setState({users})

        http.setEndpoint("http://localhost:5000/api/customers/");
    }

    handleShowEdit=(user)=>{
        //hieu ung toggle
        let users=this.state.users.map(u=>{
            if(u._id===user._id){
                u.isShow=!u.isShow;
            }
            return u;
        })
        this.setState({users:users})
    }

    handleShowCreate=()=>{
        let new_user_isShow=!this.state.new_user_isShow
        this.setState({new_user_isShow:new_user_isShow})
    }

    handleDelete=async (userId)=>{
        //xoa user tu database
        await http.deleteData(userId);
        window.document.location.reload();
    }

    
    renderOptionsFilter=()=>{
        return this.state.templateRenders.map(element=> <option key={element.name} value={element.name}>{element.name}</option>)
     }

    handleSubmitFilter=async ()=>{
        event.preventDefault();
        
        let filter=this.refs["filter"].value
        let filterValue=this.refs["filterValue"].value
        

        let users=await http.getFilter({
            "filter":filter,
            "filterValue":filterValue,
        });
        
        //them isShow
        users=users.map(u=>{
            u.isShow=false
            return u
        })
        this.setState({users})

     }
    render() { 
        
        return ( 
            <div className="container">
                <h2 className="text-center">Create new Customer</h2>
                <Add_new_user endPoint="http://localhost:5000/api/customers/" new_user_isShow={this.state.new_user_isShow} templateRenders={this.state.templateRenders} handleShowCreate={()=>this.handleShowCreate()}/>
                <hr/>


                <h2 className="text-center">Filter</h2>
                <form onSubmit={this.handleSubmitFilter}>
                    <div className="form-group">
                        <select className="form-control" ref="filter">
                            {this.renderOptionsFilter()}
                        </select>
                    </div>
                    <div className="form-group">
                    <input type="text" ref="filterValue" className="form-control"/>
                    </div>

                    <button className="btn btn-danger">Submit</button>
                </form>


                <hr/>
                <h2 className="text-center">Danh sach</h2>
                {this.state.users.map(u=> {
                     if(u.isShow){
                         return(
                            <React.Fragment key={u._id}>
                                <div className="user_main_info">
                                    <p>{u.fullname}</p>
                                    
                                    <button className="btn btn-primary" style={{marginRight:10}} onClick={()=>this.handleShowEdit(u)}>edit</button>
                                    {/* <button className="btn btn-primary" style={{marginRight:10}}>
                                        <a href={`/orders?user=5cda1daa39dc4b4cbb831474&customer=${u._id}`}>ADD ORDERS</a>
                                    </button> */}
                                    <button className="btn btn-warning" onClick={()=>this.handleDelete(u._id)}>delete</button>
                                </div>
                                
                                <User_detail_info user={u} templateRenders={this.state.templateRenders}/>
                                <hr/>
                            </React.Fragment>
                        )
                    }else{
                        return (
                            <React.Fragment key={u._id}>
                                <div className="user_main_info">
                                    <p>{u.fullname}</p>

                                    <button className="btn btn-primary" style={{marginRight:10}} onClick={()=>this.handleShowEdit(u)}>edit</button>
                                    <button className="btn btn-default" style={{marginRight:10}}>
                                        <a href={`/orders?user=${this.state.currentUser}&customer=${u._id}`}>ADD ORDERS</a>
                                    </button>
                                    
                                    <button className="btn btn-warning" onClick={()=>this.handleDelete(u._id)}>delete</button>
                                </div>
                                <hr/>
                            </React.Fragment>
                        )
                    }
                    
                    
                }
                   
                )}
            </div>
         );
    }
}
 
export default Customers;