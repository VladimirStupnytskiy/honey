
var glassTarePrice = 20; //грн
var floatingCartCreated = false;
var globalFloatingCart;

if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
}else{
        ready();
}

//Functions
function ready(){

    var removeCartButtons = document.getElementsByClassName("cart-remove");
    for (var i = 0; i < removeCartButtons.length;i++){
        var button = removeCartButtons[i];
        button.addEventListener("click", removeCartItem);
    }

    var quantityInputs = document.getElementsByClassName("cart-quantity")
    for (var i = 0; i < quantityInputs.length; i++) {
        var input = quantityInputs[i];
        input.addEventListener("change", quantityChanged)
    }

    var addCart = document.getElementsByClassName("add-cart");
     for (var i = 0; i < addCart.length; i++) {
        var button = addCart[i];
        button.addEventListener("click", addCartClicked)
    }

    var tareTypeSelector = document.getElementsByClassName("tareTypeSelector");
    for (var i = 0; i < tareTypeSelector.length; i++) {
        var select = tareTypeSelector[i];
        select.addEventListener("change", selectorChanged)
    }

    var jarQuantity = document.getElementsByClassName("jar-quantity");
    for (var i = 0; i < jarQuantity.length; i++) {
        var button = jarQuantity[i];
        button.addEventListener("click", mpmp)
    }

    var coll = document.getElementsByClassName("collapsible")[0];
    coll.addEventListener("click", mycollapse);
    
    window.addEventListener("scroll", myScrollFunc);

    document.getElementsByClassName("btn-buy")[0].addEventListener("click",buyButtonClicked);

  
}

function mycollapse(){
    this.classList.toggle("activex");
            var content = this.nextElementSibling;
            if (content.style.maxHeight){
              content.style.maxHeight = null;
            } else {
              content.style.maxHeight = content.scrollHeight + "px";
            }
}

function myScrollFunc(){
    if (floatingCartCreated) {
     if (window.scrollY <= 80) {
    globalFloatingCart.classList.add("cartHided");
  } else{
   globalFloatingCart.classList.remove("cartHided");
  }
}

 
}

function buyButtonClicked(){
    var cartContent = document.getElementsByClassName("cart-content")[0];     
    if (cartContent.hasChildNodes()) {
        while(cartContent.hasChildNodes()){
            cartContent.removeChild(cartContent.firstChild);
        }
        alert("Дякуємо за замовлення. Найближчим часом ми зв'яжемося з вами");
        updateTotal();
    }else alert("Корзина пуста. Додайте спочатку продукти");
}


function removeCartItem(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.remove();
    updateTotal();
}


function quantityChanged(event){
    var input = event.target;
 
    var price = input.parentElement.getElementsByClassName("cart-price")[0];
    price = parseFloat(price.innerText.replace(" грн",""));

    var totalItemPrice = input.parentElement.getElementsByClassName("item-total-price")[0];
    if (isNaN(input.value) || input.value <=0) {
        input.value = 1;
    }

    totalItemPrice.innerText=input.value*price  + "грн";
    updateTotal();
}


//addProduct to cart
function addCartClicked(event){
    var button = event.target;
    var shopProduct = button.parentElement.parentElement;
    var title = shopProduct.getElementsByClassName("product-title")[0].innerText;
    var price = shopProduct.getElementsByClassName("product-price")[0].innerText;
    var tare = shopProduct.getElementsByClassName("tare-value")[0].innerText;
    var tareType = shopProduct.getElementsByClassName("tareTypeSelector")[0].value;
    var productImg = shopProduct.parentElement.getElementsByClassName("product-img")[0].src;
    addProductToCart(title,price,productImg,tare,tareType,event);
    updateTotal();

   
}

function addProductToCart(title,price,productImg,tare,tareType,event) {
    var cartShopBox = document.createElement("div");
    cartShopBox.classList.add("cart-box");
    var cartItems = document.getElementsByClassName("cart-content")[0];
    var cartItemsNames = cartItems.getElementsByClassName("cart-product-title");

    for (var i = 0; i < cartItemsNames.length; i++) {
       
        var _tare = cartItemsNames[i].parentElement.getElementsByClassName("tare")[0].innerText;
        var _tareType = cartItemsNames[i].parentElement.getElementsByClassName("tare-type")[0].innerText;

        _tare = _tare.replace(/\(|\)/g, '');
       _tareType = _tareType.replace(/ *\([^)]*\) */g, "");
        
        if (cartItemsNames[i].innerText == title 
            && _tareType == tareType
            && _tare == tare) {
            alert("Ви вже додали цей товар в корзину");
            return;
        }
    }


    var cartBoxContent = `<img class="cart-img" src="${productImg}" height="35" />
    <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="tare-type">${tareType} <span class="tare">(${tare})</span></div>
        <div class="cart-price">${price} грн</div>
    </div>
    <input type="number" value="1" class="cart-quantity">
    <img class="cart-remove" src="img/trash.png" height="15" />
    <div class="item-total-price">${price}грн</div>
    </div>`

    cartShopBox.innerHTML = cartBoxContent;
    cartItems.append(cartShopBox);

    cartShopBox.getElementsByClassName("cart-remove")[0].addEventListener("click",removeCartItem);
    cartShopBox.getElementsByClassName("cart-quantity")[0].addEventListener("change",quantityChanged);
    pop(event);
}



function updateTotal(){
    var cartContent = document.getElementsByClassName("cart-content")[0];
    var cartBoxes = cartContent.getElementsByClassName("cart-box");
    var total = 0;
    for (var i = 0; i < cartBoxes.length; i++) {
        var cartBox = cartBoxes[i];
        var priceElement = cartBox.getElementsByClassName("cart-price")[0];
        var quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
        var price = parseFloat(priceElement.innerText.replace("грн",""));
        var quantity = quantityElement.value;
        total = total + (price * quantity);
        total = Math.round(total * 100) / 100;

        document.getElementsByClassName("total-price")[0].innerText = total + "грн"
    }


    document.getElementsByClassName("empy-cart")[0].classList.add("hided");
    if (cartBoxes.length ==0) {
    
        document.getElementsByClassName("empy-cart")[0].classList.remove("hided");
        document.getElementsByClassName("cart")[0].classList.add("hided");
    }else{
        document.getElementsByClassName("cart")[0].classList.remove("hided");
    }

    updateCartCounter(cartBoxes.length);
}

function updateCartCounter(count){
    document.getElementsByClassName("cart-counter")[0].innerText = count;

    if (count>0 && floatingCartCreated==false) {
        var floatingCart = document.createElement("div");
        floatingCart.classList.add("floatingCart");
        var cartBody = `
                <img class="mt-2 constant-tilt-shake shopping-cart-fl" id="cart-icon" src="img/bag.png" height="50"  data-bs-toggle="modal" data-bs-target="#go-to-cart">
                <span class="cart-counter-fl">0</span>
                    </div>
        `;

    floatingCart.innerHTML = cartBody;
    document.body.append(floatingCart);
    floatingCartCreated = true;
    globalFloatingCart = document.getElementsByClassName("floatingCart")[0];
  
    }

    if (floatingCartCreated) {document.getElementsByClassName("cart-counter-fl")[0].innerText = count;}

}

function selectorChanged(event){
    
    var oldPrice =  event.target.parentElement.parentElement.getElementsByClassName('product-price')[0].innerText;

    var selectorValue = event.target.value;
    var priceElement = event.target.parentElement.parentElement.getElementsByClassName('product-price')[0];


    if (selectorValue==="Скляна тара") {
         priceElement.innerText = "";
          priceElement.innerText = +oldPrice + glassTarePrice;
    }

    if (selectorValue==="Пластикова тара") {
          priceElement.innerText = "";
        priceElement.innerText = +oldPrice - glassTarePrice;
    }
}

function mpmp(event){
    var button = event.target;

    var product = button.parentElement;

    var minus = product.getElementsByClassName('minus')[0];
    var value = product.getElementsByClassName('tare-value')[0];
    var plus = product.getElementsByClassName('plus')[0];

    var priceElement = product.parentElement.getElementsByClassName('product-price')[0];
    var price = priceElement.innerText;

    var selectorValue = product.parentElement.getElementsByClassName('tareTypeSelector ')[0].value;

      if (button.classList.contains("minus")) {
        if (minus.classList.contains("empty-small")) {
            minus.classList.add("full-small");
            minus.classList.remove("empty-small");
            plus.classList.add("empty-large");
            plus.classList.remove("full-large");
            value.textContent="0,5л";

            if (selectorValue==="Скляна тара") {
                 priceElement.innerText = (+price-glassTarePrice)/2 +glassTarePrice;
            }else
            priceElement.innerText = price/2;
        }

    }

    if (button.classList.contains("plus")) {
      
          if (plus.classList.contains("empty-large")) {
            plus.classList.add("full-large");
            plus.classList.remove("empty-large");

            minus.classList.add("empty-small");
            minus.classList.remove("full-small");
            value.textContent="1,0л";

               if (selectorValue==="Скляна тара") {
                 priceElement.innerText = (+price-glassTarePrice)*2 +glassTarePrice;
            }else
            priceElement.innerText = price*2;

        
        }   
    }  
}

function pop (e) {
  e.target.classList.add("greened");
  e.target.classList.add("widthed");
  e.target.innerHTML = '<img src="img/ok2.png" height="40"/>';
  setTimeout(function(){
    e.target.classList.remove("greened");
           e.target.innerText = "Додати в корзину";
           

  }, 3000);

  let amount = 5;
    // Quick check if user clicked the button using a keyboard
  if (e.clientX === 0 && e.clientY === 0) {
    const bbox = e.target.getBoundingClientRect();
    const x = bbox.left + bbox.width / 2;
    const y = bbox.top + bbox.height / 2;
    for (let i = 0; i < 30; i++) {
      // We call the function createParticle 30 times
      // We pass the coordinates of the button for x & y values
      createParticle(x, y, e.target.dataset.type);
    }
  } else {
    for (let i = 0; i < amount; i++) {
      createParticle(e.clientX, e.clientY, e.target.dataset.type);
    }
  }
}

function createParticle (x, y, type) {
  const particle = document.createElement('particle');
  document.body.appendChild(particle);
  let width = Math.floor(Math.random() * 30 + 35);
  let height = width;
  let destinationX = (Math.random() - 0.5) * 300;
  let destinationY = (Math.random() - 0.5) * 300;
  let rotation = Math.random() * 520;
  let delay = Math.random() * 200;
  
  switch (type) {
    case 'mario':
      particle.style.backgroundImage = 'url(img/bee2.png)';
      break;
  }
  
  particle.style.width = `${width}px`;
  particle.style.height = `${height}px`;
  const animation = particle.animate([
    {
      transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(0deg)`,
      opacity: 1
    },
    {
      transform: `translate(-50%, -50%) translate(${x + destinationX}px, ${y + destinationY}px) rotate(${rotation}deg)`,
      opacity: 0
    }
  ], {
    duration: Math.random() * 1000 + 5000,
    easing: 'cubic-bezier(0, .9, .57, 1)',
    delay: delay
  });
  animation.onfinish = removeParticle;
}
function removeParticle (e) {
  e.srcElement.effect.target.remove();
}

