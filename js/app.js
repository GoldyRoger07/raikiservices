const menuMobile = document.querySelector("#menuMobile"),
      openMenuBtn = document.querySelector("#openMenuBtn"),
      closeMenuBtn = document.querySelector("#closeMenuBtn")


      openMenuBtn.addEventListener("click",()=>{
            menuMobile.classList.add("show")
            console.log("open")
      })

      closeMenuBtn.addEventListener("click",closeMenuMobile)

      function closeMenuMobile(){
            menuMobile.classList.remove("show")
      }


const cvTarifs = [
      {
            type: "Basic",
            prix: "250 HTG",
            options:[
                  "Design simple et propre",
                  "1 page",
                  "Format PDF",
                  "1 modification incluse",
                  "Livraison : 24h"
            ]
      },
      {
            type: "Pro",
            prix: "450 HTG",
            options:[
                  "Design moderne et professionnel",
                  "1–2 pages",
                  "Mise en valeur des compétences",
                  "Format PDF + image",
                  "2 modifications incluses",
                  "Livraison : 3 Jours",
                  "Priorité moyenne",
                  "Meilleure lisibilité pour recruteur"
            ]
      },
      {
            type: "Premium",
            prix: "850 HTG",
            options:[
                  "Design haut de gamme (style international)",
                  "1–2 pages optimisées",
                  "Optimisation du contenu (impact + structure)",
                  "Format PDF + image + version modifiable",
                  "Modifications illimitées (raisonnables)",
                  "Livraison : 5 Jours",
                  "Priorité haute",
                  "Optimisé pour maximiser vos chances d’embauche"
            ]
      }
]

const flyerTarifs = [
      {
            type: "Basic",
            prix: "350 HTG",
            options: [
                  "Design simple",
                  "1 concept",
                  "Format image (JPG/PNG)",
                  "1 modification",
                  "Livraison : 24h"

            ]
      },
      {
            type: "Pro",
            prix: "650 HTG",
            options: [
                  "Design moderne et attractif",
                  "1 concept travaillé",
                  "Couleurs et mise en page optimisées",
                  "Format HD (réseaux sociaux)",
                  "2 modifications",
                  "Livraison : 3 Jours",
                  "Priorité moyenne",
                  "Idéal pour attirer des clients"

            ]
      },
      {
            type: "Premium",
            prix: "1,250 HTG",
            options: [
                  "Design premium (impact visuel fort)",
                  "2 propositions différentes",
                  "Effets avancés + branding",
                  "Formats multiples (réseaux + impression)",
                  "Modifications illimitées (raisonnables)",
                  "Livraison : 5 Jours",
                  "Priorité haute",
                  "Conçu pour maximiser les conversions"

            ]
      }
]

const miniaturesTarifs = [
      {
            type: "Basic",
            prix: "450 HTG",
            options: [
                  "Design simple",
                  "1 version",
                  "1 modification",
                  "Livraison : 24h"

            ]
      },
      {
            type: "Pro",
            prix: "850 HTG",
            options: [
                  "Design accrocheur",
                  "Travail sur le contraste et visibilité",
                  "1 version optimisée",
                  "2 modifications",
                  "Livraison : 3 Jours",
                  "Priorité moyenne"
            ]
      },
      {
            type: "Premium",
            prix: "1,650 HTG",
            options: [
                  "Design ultra impactant (style viral)",
                  "Analyse rapide du contenu",
                  "2 versions proposées",
                  "Modifications illimitées (raisonnables)",
                  "Livraison : 5 Jours",
                  "Priorité haute",
                  "Optimisé pour augmenter le taux de clic"
            ]
      }
]

const tarifsBtn = document.querySelectorAll(".tarif-btn")

const normalStateBtn = "text-gray-500 hover:text-gray-700";

const selectedStateBtn = "bg-white shadow-sm text-gray-900"

const basic = document.querySelector("#basic"),
      pro = document.querySelector("#pro"),
      premium = document.querySelector("#premium")

tarifsBtn.forEach((btn) => {
      btn.addEventListener("click",()=>{
            let type = btn.getAttribute("data-type")


            switch(type){
                  case "cv":
                        displayTarifs(cvTarifs)
                        break;      
                  case "flyer":
                        displayTarifs(flyerTarifs)
                        break;
                  case "miniature":
                        displayTarifs(miniaturesTarifs)
                        break;
                  
            }
            removeStateBtn()
            btn.classList.add("bg-white", "shadow-sm", "text-gray-900")

      })  
})

function removeStateBtn(){
      tarifsBtn.forEach((btn) => {
            btn.classList.remove("bg-white", "shadow-sm", "text-gray-900")
            btn.classList.add("text-gray-500", "hover:text-gray-700")
      })  
}


function displayTarifs(tarifs){
        
      fullTarifsData(tarifs[0], basic)
      fullTarifsData(tarifs[1], pro)
      fullTarifsData(tarifs[2], premium)
}      

function fullTarifsData(tarifs, tarifType){
      tarifType.querySelector(".prix").textContent = tarifs.prix
       tarifType.querySelector("ul").innerHTML = ""
      tarifs.options.forEach(option => {
            let li = document.createElement("li")
            li.classList.add("flex", "flex-col", "items-start", "gap-2.5", "text-gray-600") 
            li.innerHTML = `
                  <div class="flex items-center gap-2.5">
                  <img src="/img/pricing-checkmark.svg" alt="checkmark">
                  <span>${option}</span>
                </div>
                <div class="w-full h-px bg-landing-gray-50"></div>
            `  
            tarifType.querySelector("ul").appendChild(li)
      })    
}

const faqContainer = document.querySelector("#faqList"),
      faqs = faqContainer.querySelectorAll(".faq")

      faqs.forEach(faq =>{
            let btn = faq.querySelector("button")
            btn.addEventListener("click",()=>{
                  let status = btn.getAttribute("data-status")

                  if(status === "close")
                        openFaq(faq, btn)
                  else
                        closeFaq(faq, btn)
            })
      })

      function openFaq(faq, btn){
            btn.setAttribute("data-status","open")

           let svg = btn.querySelector("svg")

           svg.classList.remove("rotate-0")
           svg.classList.add("rotate-45")

           let textContainer = faq.querySelector(".text-container")
            
           let pHeight = textContainer.querySelector("p").offsetHeight
           faq.querySelector(".text-container").style=`max-height: ${pHeight+5}px;`

      }

      function closeFaq(faq, btn){
            btn.setAttribute("data-status","close")

           let svg = btn.querySelector("svg")

           svg.classList.remove("rotate-45")
           svg.classList.add("rotate-0")

           faq.querySelector(".text-container").style="max-height: 0px"


      }

