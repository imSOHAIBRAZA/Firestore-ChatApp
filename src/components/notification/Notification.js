import React from 'react';


const Notification=()=>{

    return (
      <div id="contact-window" className="h-100 position-relative">
      <header className="flex justify-content-between align-items-center padding-30 ">
          <div className="flex align-items-center">
              <p className="margin-0 cursor-arrow accent-color font-weight-bold">Notification</p>
          </div>

      </header>
      <section id="add-contact">
          {/* <section className="padding-15 h-50 bg-white w-50"> */}
              {/* <p className="margin-0 cursor-arrow accent-color font-weight-bold">Notification</p> */}
              {/* <Form className="flex flex-column justify-content-between" onSubmit={this.search}>
                  <Form.Control
                      type="email"
                      placeholder="Email"
                      name="email"
                      onChange={this.handleChange}
                      value={this.state.email}
                  />
                  <div id="search-result">
                      <ListGroup variant="flush">

                          {this.state.searchResult.map(v => {
                              return <ListGroup.Item key={v.id}>{v.name}<Button
                                  onClick={() => this.addContact(v.id)}>+</Button></ListGroup.Item>
                          })}


                      </ListGroup>


                  </div>

                  <div className="flex justify-content-between">
                      <Button type={"reset"} variant={"dark"}>Cancel</Button>
                      <Button type={"submit"} className="accent-btn">Search</Button>
                  </div>
              </Form> */}


          {/* </section> */}
      </section>


  </div>
      );
}
export default Notification;
