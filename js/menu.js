const e_store_menu = (() => {
  // Get elements
  const side_bar = document.getElementById("sidebar")
  const open_close = document.querySelectorAll(".menu")
  
  // Event listener for the clicking of the menu button
  open_close.forEach((element) => element.addEventListener("click", showSideMenu))
  function showSideMenu(event){
    side_bar.classList.toggle("show")
  }
  
  // Event listener for the width of window
  window.addEventListener("resize", resize)
  
  // function for resizing the browser
  function resize(event){
    if(window.innerWidth >= 700){
      hideSidebar()
    }else{
      let links = document.querySelectorAll("#sidebar > li")
      // Event listener for all the links 
      links.forEach((element) => {
        element.addEventListener("click", hideSidebar)
      })
    }
  }

  // function for hiding the sidebar menu
  function hideSidebar(event){
    side_bar.classList.remove("show")
  }
})();