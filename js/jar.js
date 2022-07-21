if(document.readyState == "loading"){
    document.addEventListener("DOMContentLoaded", ready)
}else{
    ready();
}


function ready(){
  
     //add to cart
     var jarQuantity = document.getElementsByClassName("jar-quantity");
     for (var i = 0; i < jarQuantity.length; i++) {
        var button = jarQuantity[i];
        button.addEventListener("click", mpmp)
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

      if (button.classList.contains("minus")) {
        if (minus.classList.contains("empty-small")) {
            minus.classList.add("full-small");
            minus.classList.remove("empty-small");
            plus.classList.add("empty-large");
            plus.classList.remove("full-large");
            value.textContent="0,5л";
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
            priceElement.innerText = price*2;
        }   
    }  
}



