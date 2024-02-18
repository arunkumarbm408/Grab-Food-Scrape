//scraping data  
        fetch("https://food.grab.com/sg/en/restaurants")
            .then(response => response.text())
            .then(data => {
                 if(data){
                  console.log("ok");
                    // console.log(data);
                   
                let ans=getBetween(data,'<script id="__NEXT_CONFIG__" type="application/json">','<script async="" id="__NEXT_PAGE__/restaurants" src="/_next/static/LrmXhmb2nKMxvura6iPxk/pages/restaurants.js"></script>')
                //  console.log(ans);
                   let ans1=getBetween(ans,'<script id="__NEXT_DATA__" type="application/json">','</script>')
                    //  console.log(ans1);
                     let ans2=JSON.parse(ans1)
                     console.log(ans2);

                     let obj=ans2?.props?.initialReduxState?.pageRestaurantsV2?.entities?.restaurantList;
                     console.log(obj);
                     const valuesArray = Object.values(obj);

                      console.log(valuesArray);
                     valuesArray?.forEach((ele)=>{
                        //  console.log(ele);
                         requiredData1(ele)
                     })
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
            });

        

function getBetween(pageSource, firstData, secondData) {
    try {
      const resSplit = pageSource.split(firstData);
      const indexSec = resSplit[1].indexOf(secondData);
      return resSplit[1].substring(0, indexSec);
    } catch (e) {
      return "";
    }
  }




  //chchh
  const interceptorScript = document.createElement("script");
interceptorScript.src = chrome.runtime.getURL("library/xhr.js");

interceptorScript.onload = function () {
  this.remove();
};

//xhr starts
(document.head || document.documentElement).appendChild(interceptorScript);
async function handleXhrIntercepted(event) {
  try {
    const { response } = event.detail;
    // console.log(response);
    let ans=JSON.parse(response)
    console.log(ans?.searchResult?.searchMerchants?.[0]?.address?.name);
    ans?.searchResult?.searchMerchants.forEach((element) => {
    
      requiredData1(element);
    });
     
 
  } catch (error) {
    console.log(error);
  }
}




document.addEventListener("XHR_INTERCEPTED", handleXhrIntercepted);




///payload
function requiredData1(element) {
//  console.log(element);


  try {
    const result = {
      Restaurant_Name: element?.name || element?.address?.name,
      Restaurant_Cuisine: element?.cuisine?.join(",") ||element?.merchantBrief?.cuisine?.join(","),
      Restaurant_Rating: element?.rating ||element?.merchantBrief?.rating  ,
      Estimate_time_of_Delivery : `${ element?.estimatedDeliveryTime} mins`||`${element?.estimatedDeliveryTime} mins` ,
      Restaurant_Distance_from_Delivery_Location:  element?.distanceInKm + " Km"||element?.merchantBrief?.distanceInKm + " Km",
      Promotional_Offers_Listed_for_the_Restaurant: element?.promoDescription ||element?.bottomTextLabels?.[0] || "",
      Restaurant_Notice_If_Visible:"" ,
      Image_Link_of_the_Restaurant: element?.photoHref ||element?.merchantBrief?.photoHref ,
      Is_promo_available: element?.hasPromo || element?.merchantBrief?.promo?.hasPromo||"",
      Restaurant_ID: element?.id,
      Restaurant_latitude: element?.latitude || element?.latlng?.latitude,
      Restaurant_longitude: element?.longitude || element?.latlng?.longitude ,
      Estimate_Delivery_Fee: element?.estimatedDeliveryFee?.price ||"" ,
    
     
    };
    console.log(result);
    console.log(JSON.stringify(result));
   
  } catch (error) {
    console.log(error);
  }
}