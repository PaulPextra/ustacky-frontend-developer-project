const e_store_cart = (() => {
  // Adding and removeing variables
  const cart_add = "ADD TO CART"
  const cart_remove = "REMOVE FROM CART"
  const gadget_button = document.querySelectorAll(".add-cart")
  const cart_num = document.getElementById("cart-number")
  const table = document.querySelector(".cart-bills > table")
  const cart_heading = ["S/N", "Item", "Price", "Quantity"]
  const minus_alert = "You cannot have less than 1 item. If you wish to remove the item click remove."
  let serialCount = 0
  const naira = "&#8358;"

  // gadgets properties defined here as an array
  const gadgets_db = [
    {
      id: 0,
      name: "Samung Tv",
      price: 500000,
      qty: 1
    },
    {
      id: 1,
      name: "Pixel 4a",
      price: 100000,
      qty: 1
    },
    {
      id: 2,
      name: "Ps 5",
      price: 300000,
      qty: 1
    },
    {
      id: 3,
      name: "Macbook Air",
      price: 600000,
      qty: 1
    },
    {
      id: 4,
      name: "Apple Watch",
      price: 20000,
      qty: 1
    },
    {
      id: 5,
      name: "Air Pods",
      price: 10000,
      qty: 1
    }
  ]
  const item_added = []

  // hover effect to show prices
  const gadget_hover = document.querySelectorAll(".gadget-card > div")
  gadget_hover.forEach((element, index) => {
    element.addEventListener("mouseover", () => {
      let hover_element = element.querySelector(".gadget-mask > p")
      let formatedNumber = formatNumber(gadgets_db[index].price)
      hover_element.innerHTML = (`${escapeHtml(naira)}${formatedNumber}`)
    })
  })

  // Cart modal box elements
  const open_modal = document.getElementById("open-cart-modal")
  const modal = document.getElementById("cart-modal")
  open_modal.addEventListener("click", modalBox)

  // modal button for continuing shopping
  const cont_shop = document.getElementById("cont-shop")

  // event handler for continue shopping
  cont_shop.addEventListener("click", modalBox)
  
  // Function for adding and removing from cart
  gadget_button.forEach((element, index) => element.addEventListener("click", 
    () => {
      // if no item has been added to cart
      if(item_added.length == 0){
        createEvent(element, index)
      }else if(item_added.filter((item) => item.id == index).length < 1){ // if items has been added to cart but not this particular item
        createEvent(element, index)
      }else{ // if item has been added and is now been removed
        removeEvent(element, index)
      }
  }))

  // funciton partaining to adding an item to the shopping cart
  function createEvent(element, index){
    createItem(index)
    changeGadgetColour(element, cart_remove)
    setCartNum()
  }

  // function for removing an item from the shopping cart
  function removeEvent(element, index){
    removeItem(index)
    changeGadgetColour(element, cart_add)
    setCartNum()
  }
  
  // function for changing the color of a gadget
  function changeGadgetColour(element, text){
    element.innerHTML = text
    element.classList.toggle("add-to-cart")
  }

  // Set the cart number of items added
  function setCartNum(){
    cart_num.innerHTML = item_added.length
  }

  // Function that calculates the total amount to be paid
  function setTotal(){
    let total_ele = document.querySelector("span.cart-total")
    total_ele.innerHTML = formatNumber(getTotal())
  }

  // function that gets the total amount to be paid
  function getTotal(){
    let total = 0
    for(let item of item_added){
      total += (item.qty * item.price)
    }
    return total
  }

  // Function for opening and closing modal box
  function modalBox(){
    setTotal()
    const input_span = document.querySelectorAll(".cart-form form > div.input span")
    input_span.forEach((item) => {item.innerHTML = ""})
    modal.addEventListener("click", closeModal)
    if(modal.classList.contains("show")){
      modal.classList.remove("show")
    }else{
      modal.classList.add("show")
    }
  }

  // Function that closes the modal box when outside the modal box is clicked
  function closeModal(event){
    event.preventDefault()
    event.stopPropagation()
    if(event.target == modal){
      modal.classList.remove("show")
    }
  }

  // function for creating the naira symbol
  function escapeHtml(text){
    return new DOMParser().parseFromString(text, "text/html").documentElement.textContent
  }

  // Function that creates a new item added to cart and removes item added to cart
  function createItem(id){
    // get the gadget
    let gadget = gadgets_db.filter(item =>
      item.id == id
    )[0]

    item_added.push({
      id: gadget.id,
      name: gadget.name,
      price: gadget.price,
      qty: gadget.qty,
    })
    // append the item to the table
    makeItem(id)
  }

  // Get a gadget item
  function getGadget(id){
    return item_added.filter((item) => item.id == id)[0]
  }

  // creates a gadget row item in the table body to add to the shopping cart
  function makeItem(id){
    let row = document.createElement("tr")
    let remove_button = "Remove"
    
    // find the item in the gadgets database using the id of the gadget element
    gadget = item_added.filter(item =>
      item.id == id
    )[0]
    
    // create the a row and columns for a gadget
    // s/n column
    let s_n = document.createElement("td")
    let s_n_text_node = document.createTextNode(serialCount + 1)
    s_n.appendChild(s_n_text_node)
    
    // item column
    let name = document.createElement("td")
    let name_text_node = document.createTextNode(gadget.name)
    name.appendChild(name_text_node)
    
    // price column
    let price = document.createElement("td")
    let formatedNumber = formatNumber(gadget.price)
    let price_text_node = document.createTextNode(`${escapeHtml(naira)}${formatedNumber}`)
    price.appendChild(price_text_node)
    
    // quantity column
    let qty = document.createElement("td")
    let qty_text_node = document.createTextNode(gadget.qty)

    // minus button
    let minus = document.createElement("span")
    let minus_text = document.createTextNode("-")
    minus.appendChild(minus_text)
    
    // plus button
    let plus = document.createElement("span")
    let plus_text = document.createTextNode("+")
    
    // append the nodes to the row in the table
    qty.appendChild(minus)
    qty.appendChild(qty_text_node)
    qty.appendChild(plus)
    qty.classList.add("cart-qty")
    minus.addEventListener("click", () => {
      let gadgetItem = getGadget(id)
      gadgetItem.qty == 1? alert(minus_alert): gadgetItem.qty = parseInt(gadgetItem.qty) - 1
      qty_text_node.textContent = gadgetItem.qty
      setTotal()
    })
    plus.appendChild(plus_text)
    plus.addEventListener("click", () => {
      let gadgetItem = getGadget(id)
      gadgetItem.qty = parseInt(gadgetItem.qty) + 1
      qty_text_node.textContent = gadgetItem.qty
      setTotal()
    })
    
    // button element
    let button = document.createElement("td")
    let button_span = document.createElement("span")
    let button_text_node = document.createTextNode(remove_button)
    button_span.appendChild(button_text_node)
    button.appendChild(button_span)
    button_span.classList.add("cart-remove")
    button_span.setAttribute("data", `cart-r-${id}`)
    button_span.addEventListener("click", () => {
      let element = gadget_button[id]
      removeItem(id)
      setTotal()
      setCartNum()
      changeGadgetColour(element, cart_add)
    })

    row.appendChild(s_n)
    row.appendChild(name)
    row.appendChild(price)
    row.appendChild(qty)
    row.appendChild(button)

    // create the heading if there is no element added to the cart yet
    if (item_added.length <= 1){
      let body = prepareTable()
      body.appendChild(row)
    }else{
      let tableBody = document.getElementById("cart-bills-table")
      tableBody.appendChild(row)
    }
    
    // increment the count of items shopped for
    serialCount += 1
  }

  // creates table to list the gadgets shopped for
  function prepareTable(){
    //check if the table body already exists
    let table_body_id = "cart-bills-table"
    let table_body = table.querySelector(`#${table_body_id}`)
    if(table_body){
      return table_body 
    }else{
      let body = document.createElement("tbody")
      body.id = table_body_id
      table.appendChild(body)
      return body
    }
  }

  // Remove items from the shopping cart
  function removeItem(key){
    let index_to_remove = 0
    let tableBody = document.getElementById("cart-bills-table")

    // remove item from the item list
    for(let index in item_added){
      if(item_added[index].id == key){
        index_to_remove = index
        item_added.splice(index_to_remove, 1)
        break
      }
    }

    // recreate the cart table
    //empty the table first
    tableBody.remove()
    //set serial count to 0
    serialCount = 0
    for(let index in item_added){
      if(index == 0){
        prepareTable()
      }
      makeItem(item_added[index].id)
    }
  }

  // formats a number using comma thousand separator
  function formatNumber(num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  // hides the shopping modal box
  function hide_modal(){
    // Clear table body
    let tableBody = document.getElementById("cart-bills-table")
    tableBody.remove()
  }

  // clears all the items in the shopping cart list and set the count in the list to 0
  function clearItems(){
    while(item_added.length > 0){
      item_added.pop()
    }
    serialCount = 0
  }

  // using closure to return specific items to continue shopping or adding to shopping cart
  return {
    total: getTotal,
    hide_modal: hide_modal,
    items: item_added,
    gadgets: gadgets_db,
    clearItems: clearItems
  }
})()