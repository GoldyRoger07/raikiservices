const menuMobile = document.querySelector("#menuMobile"),
      openMenuBtn = document.querySelector("#openMenuBtn"),
      closeMenuBtn = document.querySelector("#closeMenuBtn")


      openMenuBtn.addEventListener("click",()=>{
            menuMobile.classList.add("show")
            console.log("open")
      })

      closeMenuBtn.addEventListener("click",()=>{
            menuMobile.classList.remove("show")
            console.log("Close")
      })