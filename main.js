const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCounter = document.getElementById("cart-count");
const inputAddress = document.getElementById("address");
const AddressWarn = document.getElementById("address-warn");

let cart = [];

cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex";
});
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none";
});
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none";
    }
});

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn");
    if(parentButton){
        const name = parentButton.getAttribute("data-name");
        const value = parseFloat(parentButton.getAttribute("data-price"));
        addToCart(name, value);
    }
});

function addToCart(name, value){

    const existingItem = cart.find(item => item.name == name);
    if(existingItem){
        existingItem.quantity +=1;        
    }else {
        cart.push({
            name: name,
            value: value,
            quantity: 1
        });    
    }
    
    updateCartModal();
}

function updateCartModal (){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");
        cartItemElement.innerHTML = `
            <div class="flex item-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.value.toFixed(2)}</p>
                </div>
                 <button class="remove-from-cart-btn" data-name="${item.name}">Remover</button>                
            </div>
        `

        total += item.value * item.quantity;
        cartItemsContainer.appendChild(cartItemElement);
    });
    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    })
    cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name");

        removeItemCart(name);
    }
})

function removeItemCart (name){
    const index = cart.findIndex(data => data.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -=1;
        }else{
            cart.splice(index, 1);
        }
        updateCartModal();
    }
}

inputAddress.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        AddressWarn.classList.add("hidden");
        inputAddress.classList.remove("border-red-500");
    }
});

checkoutBtn.addEventListener("click", function(){
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "O restaurante esta fechado no momento.",
            duration: 3000,            
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            }
        }).showToast();;
        return;
    }

    if(cart.length === 0)return;    
    if(inputAddress.value === ""){
        AddressWarn.classList.remove("hidden");
        inputAddress.classList.add("border-red-500");
        return;
    }

    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${ item.quantity }) Preço: R$ ${ item.value.toFixed(2) } | `
        )
    }).join("");

    const message = encodeURIComponent(cartItems);
    const phone = "5521979664294";    
    window.open(`https://wa.me/${phone}?text=${message} Endereco:${inputAddress.value}`, "_blank");
    cartModal.style.display = "none";
    cart = [];
    updateCartModal();
});


function checkRestaurantOpen (){
    const data = new Date();
    const hora = data.getHours();
    return hora >=18 && hora < 22;
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
