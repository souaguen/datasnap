import React, { Component } from "react";
import { Modal, Image, Row, Form, InputGroup, Button } from "react-bootstrap";

class HomePage extends Component {
    state = {
        myImg: "",
        users: [],
        isAdmin: false,
        useSnap: null,
        showMod: false,
        currUse: ""
    }

    handleSubmit = (e) => {
        if (e.target.snap.value && e.target.snap.value !== "") {
            addSnap(e.target.snap.value).then((res) => {
                let users = res.data.files.map((value) => {
                    return value.replace(/\.jpg/, "");
                });
                this.setState({myImg: res.data.pic, users});
            });
        }
        e.target.snap.value = "";
        e.preventDefault();
    }
    
    handleDelete = (username) => {
        delSnap(username).then((res) => {
            let users = res.data.files.map((value) => {
                return value.replace(/\.jpg/, "");
            });
            this.setState({myImg: res.data.pic, users});
        });
    }

    getOneSnap = (snapuser) => {
        getSnap(snapuser).then((res) => {
            this.setState({useSnap: res.data, showMod: true, currUse: snapuser})
        });
    }

    UNSAFE_componentWillMount() {
        snaplist().then((res) => {
            let users = res.data.files.map((value) => {
                return value.replace(/\.jpg/, "");
            });
            this.setState({myImg: res.data.pic, users});
        });
    }

    render() {
        const { myImg, users, isAdmin, useSnap, showMod, currUse } = this.state;
        let coord = [];
        for (let x = 0, i = 0; x < (users.length * 100) && i < 16; x += 100, i++)
            coord.push({x, user: users[i]});
        return(
            <div style={{border: "2px solid black", display: "flex", height: "100%", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
                {myImg !== "" &&
                    <div style={{ display: "flex", flexWrap: "wrap", width: "400px" }}>
                        {coord.map((value, index) => (
                            <div key={index} style={{display: "block", width: "100px", height: "100px", overflow: "hidden", cursor: "pointer"}}>
                                <img src={myImg} width={100 * 16} alt="snaps" style={{marginLeft: "-" + value.x + "px"}}/>
                                {(isAdmin) && 
                                    <span onClick={() => { this.handleDelete(value.user) }} style={{backgroundColor: "rgba(255, 255, 255, 0.8)", position: "relative", top: "-100px", left: "70px", fontSize: "25px", color: "#B53471", fontWeight: "bold", cursor: "pointer"}}>&#10005;</span>
                                }
                                <div style={{width: "100px", height: "100px", borderRadius: "15px", backgroundColor: "rgba(255, 255, 255, 0.0)", position: "relative", top: "-105px", zIndex: "10"}} onMouseLeave={(e) => { e.target.style.backgroundColor = "rgba(255, 255, 255, 0.0)" }} onMouseEnter={(e) => e.target.style.backgroundColor = "rgba(255, 255, 255, 0.5)"} onClick={() => this.getOneSnap(value.user)}></div>
                            </div>
                        ))}
                    </div>
                }
                <Form onSubmit={this.handleSubmit} style={{marginTop: "35px"}}>
                    <InputGroup>
                        <InputGroup.Prepend>
                            <Button variant="success">Participez</Button>
                        </InputGroup.Prepend>
                        <Form.Control type="text" aria-describedby="inputGroupPrepend" name="snap" placeholder="Entre ton snap ici"/>
                    </InputGroup>
                </Form>
                <Modal show={showMod} onHide={() => this.setState({showMod: false, useSnap: null})}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            @{currUse}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="justify-content-center"> 
                            <Image src={useSnap} />
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

const snaplist = () => {
    return fetch("http://localhost:8080/snaplist").then((response) => {
        return response.json();
    });
}

const addSnap = (snap) => {
    if (snap && snap !== "") {
        return fetch("http://localhost:8080/push/"+snap).then((response) => {
            return response.json();
        });
    }
}

const delSnap = (snap) => {
    if (snap && snap !== "") {
        return fetch("http://localhost:8080/remove/"+snap, {
            method: "DELETE"
        }).then((response) => {
            return response.json();
        });
    }
}

const getSnap = (snap) => {
    if (snap && snap !== "") {
        return fetch("http://localhost:8080/snap/"+snap).then((response) => {
            return response.json();
        });
    }
}
export default HomePage;