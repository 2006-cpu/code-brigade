import React from 'react';

const Footer = () => {
    return (
        <>
        <h2 style={{textAlign: "center", paddingTop: "150px"}}><a style={{backgroundColor: "white", color: "black", border: "none"}} href="https://github.com/2006-cpu/code-brigade" target="_blank">Contact Us</a></h2>
        <div className="footer-container">
            <div className="nameWrapper">
                <div>
                    <span className="material-icons">
                    masks
                    </span>  
                </div>
                <div>
                    <a href="https://www.linkedin.com/in/zacharytheodoregarrett/" target="_blank" className="teamMembers" style={{backgroundColor: "white", color: "black", border:"none", fontSize: "12px", margin: "5px", justifyContent: "center"}}>Zach Garrett</a>
                </div>
            </div>
            <div className="nameWrapper">
                <div>
                   <span className="material-icons">
                    masks
                    </span> 
                </div>
                <div>
                    <a href="https://www.linkedin.com/in/laurencereeds/" target="_blank" className="teamMembers" style={{backgroundColor: "white", color: "black", border:"none", fontSize: "12px", margin: "5px", justifyContent: "center"}}>Laurence Reeds</a>
            </div>
            </div>
            <div className="nameWrapper">
                <div>
                   <span className="material-icons">
                    masks
                    </span> 
                </div>
                <div>
                <a href="https://www.linkedin.com/in/spencer-sharpe-912b3910b/" target="_blank" className="teamMembers" style={{backgroundColor: "white", color: "black", border:"none", fontSize: "12px", margin: "5px", justifyContent: "center"}}>Spencer Sharpe</a>
                </div>
            </div>
            <div className="nameWrapper">
                <div>
                    <span className="material-icons">
                    masks
                    </span>
                </div>
                <div>
                    <a href="https://www.linkedin.com/in/tillywright/" target="_blank" className="teamMembers" style={{backgroundColor: "white", color: "black", border:"none", fontSize: "12px", margin: "5px", justifyContent: "center"}}>Tilly Wright</a>
                </div>
            </div>
        </div>
        </>
    )

}

export default Footer;