const e_store_form = (() => {
  // get elements
  const name = document.getElementById("name")
  const email = document.getElementById("email")
  const phone = document.getElementById("phone")
  const input_span = document.querySelectorAll(".cart-form form > div.input span")
  const submit = document.getElementById("checkout")
  const modal = document.getElementById("cart-modal")
  const gadget_button = document.querySelectorAll(".add-cart")
  const cart_num = document.getElementById("cart-number")
  const cart_add = "ADD TO CART"
  let error = false
  
  // event operation when leaving the name input field
  name.addEventListener("blur", () => {
    validateName()
  })
  
  // event operation when leaving the email input field
  email.addEventListener("blur", () => {
    validateEmail()
  })
  
  // event operation when leaving the phone number input field
  phone.addEventListener("blur", () => {
    validatePhone()
  })

  // validate name field
  const validateName = () => {
    if(name.value == ""){
      input_span[1].innerHTML = "Please enter your name"
      error = true
    }else{
      input_span[1].innerHTML = ""
      error = false
    }
  }

  // validate email field
  const validateEmail = () => {
    if(email.value == ""){
      input_span[2].innerHTML = "Please enter an email"
      error = true
    }else{
      input_span[2].innerHTML = ""
      error = false
    }
  }

  // validate phone field
  const validatePhone = () => {
    let value = phone.value
    if(value == ""){
      input_span[3].innerHTML = "Please enter your telephone number"
      error = true
    }else if(value.length !== 11){
      if(value.length < 11){
        input_span[3].innerHTML = "Phone Number cannot be less than 11 characters"
        error = true
      }else{
        input_span[3].innerHTML = "Phone Number cannot be greater than 11 characters"
        error = true
      }
    }else{
      let ifNum = value.split("").filter(item => (isNaN(item)))
      if(ifNum.length > 0){
        input_span[3].innerHTML = "Phone number can only be numbers"
        error = true
      }else{
        input_span[3].innerHTML = ""
        error = false
      }
    }
  }

  const validateTotal = () => {
    error = e_store_cart.total() <= 0? true: false
  }

  // event operation when submitting the form
  submit.addEventListener("click", (event) => {
    event.preventDefault()
    // check if the required input fields are empty
    validateName()
    validateEmail()
    validatePhone()
    validateTotal()
    if(name.value == "" || email.value == "" || phone.value == ""){
      input_span[0].innerHTML = "Please fill details"
    }else if(!error){
      input_span[0].innerHTML = ""
      modal.classList.remove("show")
      // call paystack api
      payWithPaystack(event)
    }else{
      console.log("There is error")
      input_span[0].innerHTML = "Did you add items to cart? Unknown error!"
    }
  })

  // Paystack api call
  function payWithPaystack(e) {
    e.preventDefault();
    let handler = PaystackPop.setup({
      key: 'pk_test_e47d4a8715c5c3810abe24e7654be2128cb7f656', // Replace with your public key
      email: email.value,
      amount: e_store_cart.total() * 100,
      ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
      // label: "Optional string that replaces customer email"
      onClose: function(){
        // alert('Window closed.');
      },
      callback: function(response){
        // let message = 'Payment complete! Reference: ' + response.reference;
        // alert(message);
        
        // Show summary of purchase
        showSummary()

        // Clear the items added
        e_store_cart.clearItems()
        
        // Clear the cart table
        e_store_cart.hide_modal()
        
        // Set the cart number
        cart_num.innerHTML = 0
        
        // Clear all the button's colour to default
        gadget_button.forEach((element) => {
          element.innerHTML = cart_add
          element.classList.remove("add-to-cart")
          element.classList.add("add-cart")
        })
      }
    });
    handler.openIframe();
  }

  // show the summmary after purchasing using paystack
  function showSummary(){
    // Summary modal
    let modal = document.createElement("div")
    document.querySelector("body").prepend(modal)
    modal.id = "cart-summary"
    
    
    // Add the modal div to the modal
    let modal_div = document.createElement("div")
    modal.appendChild(modal_div)

    // Name div
    let name_div = document.createElement("div")
    name_div.classList.add("cart-summary-nav")
    // first span
    let span_1 = document.createElement("span")
    let span_1_text = document.createTextNode("Thank You, ")
    span_1.appendChild(span_1_text)
    name_div.appendChild(span_1)
    // second span with actual name
    let span_2 = document.createElement("span")
    let span_2_text = document.createTextNode(`${name.value}`)
    span_2.appendChild(span_2_text)
    name_div.appendChild(span_2)
    // third span
    let span_3 = document.createElement("span")
    let span_3_text = document.createTextNode(", Your Order Has Been Received")
    span_3.appendChild(span_3_text)
    name_div.appendChild(span_3)
    
    // Summary image
    let summary_image = document.createElement("div")
    summary_image.classList.add("cart-summary-image")

    // Summary title
    let summary_title = document.createElement("p")
    let title_text = document.createTextNode("Summary")
    summary_title.classList.add("cart-summary-title")
    summary_title.appendChild(title_text)

    // Summary table
    let table = document.createElement("table")
    table.classList.add("cart-summary-table")
    let tbody = document.createElement("tbody")
    table.appendChild(tbody)
    let heading_row = document.createElement("tr")
    let headings = ["S/N", "Item", "Quantity"]
    // Add the heading to the table
    headings.forEach((item) => {
      let ele = document.createElement("th")
      let ele_text = document.createTextNode(item)
      ele.classList.add("summary-heading")
      ele.appendChild(ele_text)
      heading_row.appendChild(ele)
    })
    tbody.appendChild(heading_row)

    // Add the items to the table
    e_store_cart.items.forEach((item, index) => {
      // Contains row details and create row
      let row = document.createElement("tr")
      row.classList.add("summary-tr")

      // Serial number
      let s_n = document.createElement("td")
      let sn_text = document.createTextNode(`${index + 1}`)
      s_n.appendChild(sn_text)

      // Name of gadget
      let name = document.createElement("td")
      let name_text = document.createTextNode(`${item.name}`)
      name.appendChild(name_text)

      // Quantity of gadget
      let qty = document.createElement("td")
      let qty_text = document.createTextNode(`${item.qty}`)
      qty.appendChild(qty_text)
      
      // Append everything to the table body
      row.appendChild(s_n)
      row.appendChild(name)
      row.appendChild(qty)
      tbody.appendChild(row)
    });

    // Button div
    let button_div = document.createElement("div")
    button_div.classList.add("cart-summary-button")
    let button = document.createElement("span")

    button.addEventListener("click", () => {
      modal.remove()
    })
    let button_text = document.createTextNode("Ok")
    button.appendChild(button_text)
    button_div.appendChild(button)

    // Append everything
    modal_div.appendChild(name_div)
    modal_div.appendChild(summary_image)
    modal_div.appendChild(summary_title)
    modal_div.appendChild(table)
    modal_div.appendChild(button_div)
  }
})()